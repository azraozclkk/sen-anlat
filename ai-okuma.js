/* Sen Anlat: yapay zekâ ile Türkçe metin okuma motoru.
 *
 * Model: Antalia-2 Mini (PatientDesk AI, Apache-2.0) — https://huggingface.co/cloud0day3/antalia-mini
 * Tarayıcı (ONNX) sürümü ve bu dosyadaki çıkarım kodu şu projeden uyarlanmıştır:
 *   fr0stb1rd/antalia-mini-web (Apache-2.0) — https://github.com/fr0stb1rd/antalia-mini-web
 *   (commit 459585b, app.js: model yükleme ve synthPieces). Ayrıntılar: ANTALIA-NOTICE.txt
 *
 * Ses tamamen kullanıcının cihazında üretilir; metin hiçbir sunucuya gönderilmez.
 * Gerekenler (sırayla yüklenir): onnxruntime-web, normalize.js (AntaliaText), audio.js (AntaliaAudio).
 */
"use strict";

const AiOkuma = (() => {
  const ORT_VERSION = "1.30.0";
  const MODEL_BASE = "https://huggingface.co/fr0stb1rd/antalia-mini-web-onnx/resolve/main";
  const MODEL_FILES = ["text_stage.onnx", "sound_stage.onnx", "decoder.onnx"];
  const DICT_FILES = ["foreign_dict.json", "foreign_parts.json", "known_words.json", "english_i.json"];
  const CACHE_NAME = "sen-anlat-ai-okuma-v1";
  const RATE = 48000, HOP = 512, N_MELS = 128, STACK = 2;
  const NOISE_DIM = N_MELS * STACK, MAX_DUR_FRAMES = 60;
  const TEMPERATURE = 0.6, LOG_GEM = Math.log(1.3);
  const PREFIX = "ee, ", SUFFIX = " ee.", PREFIX_INITIALS = new Set(["ö", "ı"]);
  const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

  let sessText = null, sessSound = null, sessDec = null, hazirSozu = null;

  // ---------- İndirme (önbellekli: ilk seferden sonra internet gerekmez) ----------
  async function onbellekli(url) {
    const kavanoz = ("caches" in self) ? await caches.open(CACHE_NAME).catch(() => null) : null;
    if (kavanoz) {
      const var_ = await kavanoz.match(url).catch(() => null);
      if (var_) return { res: var_, onbellekten: true };
    }
    const net = await fetch(url);
    if (!net.ok) throw new Error(`${url.split("/").pop()} indirilemedi (HTTP ${net.status})`);
    if (kavanoz) kavanoz.put(url, net.clone()).catch(() => {});
    return { res: net, onbellekten: false };
  }

  async function tamponIndir(url, ilerleme) {
    const { res } = await onbellekli(url);
    const toplam = Number(res.headers.get("content-length")) || 0;
    const parcalar = []; let yuklenen = 0;
    const okuyucu = res.body.getReader();
    for (;;) {
      const { done, value } = await okuyucu.read();
      if (done) break;
      parcalar.push(value); yuklenen += value.byteLength;
      ilerleme(yuklenen, toplam);
    }
    const buf = new Uint8Array(yuklenen);
    let o = 0; for (const c of parcalar) { buf.set(c, o); o += c.byteLength; }
    return buf;
  }

  // ---------- Model yükleme ----------
  function yukle(ilerlemeBildir = () => {}) {
    if (hazirSozu) return hazirSozu;
    hazirSozu = (async () => {
      ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
      ort.env.wasm.proxy = true;
      const durum = Object.fromEntries(MODEL_FILES.map(f => [f, { y: 0, t: 0 }]));
      const bildir = () => {
        const y = MODEL_FILES.reduce((a, f) => a + durum[f].y, 0);
        const t = MODEL_FILES.reduce((a, f) => a + durum[f].t, 0);
        ilerlemeBildir(t ? Math.min(100, Math.round(100 * y / t)) : 0);
      };

      const sozlukler = Promise.all(DICT_FILES.map(async (f) => (await onbellekli(`${MODEL_BASE}/${f}`)).res.json()))
        .then(([foreign, parts, known, englishI]) => AntaliaText.setData({ foreign, parts, known, englishI }));
      const tamponlar = Promise.all(MODEL_FILES.map(f =>
        tamponIndir(`${MODEL_BASE}/${f}`, (y, t) => { durum[f] = { y, t }; bildir(); })));

      const [buflar] = await Promise.all([tamponlar, sozlukler]);
      const olustur = (eps) => Promise.all(buflar.map(b =>
        ort.InferenceSession.create(b, { executionProviders: eps, graphOptimizationLevel: "all" })));
      try {
        [sessText, sessSound, sessDec] = await olustur(IS_IOS ? ["wasm"] : ["webgpu", "wasm"]);
        for await (const _ of sentezle("Merhaba.", 1)) {} // ısınma
      } catch (e) {
        // WebGPU sorun çıkarırsa güvenli moda (WASM) geç
        for (const s of [sessText, sessSound, sessDec]) await s?.release?.().catch(() => {});
        ort.env.wasm.proxy = false;
        [sessText, sessSound, sessDec] = await olustur(["wasm"]);
        for await (const _ of sentezle("Merhaba.", 1)) {}
      }
      ilerlemeBildir(100);
      return true;
    })().catch((e) => { hazirSozu = null; throw e; });
    return hazirSozu;
  }

  // ---------- Metni model parçalarına böl ----------
  function parcala(text, maxChars = 250, firstChars = 80) {
    const cumleler = text.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    const parcalar = []; let cur = "";
    for (const s of cumleler) {
      const sinir = parcalar.length === 0 ? firstChars : maxChars;
      if (cur && cur.length + 1 + s.length > sinir) { parcalar.push(cur); cur = s; }
      else cur = cur ? `${cur} ${s}` : s;
    }
    if (cur) parcalar.push(cur);
    return parcalar;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randn(len, rand) {
    const o = new Float32Array(len);
    for (let i = 0; i < len; i += 2) {
      const u1 = Math.max(rand(), 1e-9), u2 = rand();
      const r = Math.sqrt(-2 * Math.log(u1)), th = 2 * Math.PI * u2;
      o[i] = r * Math.cos(th);
      if (i + 1 < len) o[i + 1] = r * Math.sin(th);
    }
    return o;
  }

  // ---------- Sentez: her parça için { audio (Float32, 48 kHz), metin, sure } üretir ----------
  // baslangic: kaçıncı parçadan başlanacağı (0'dan). Parçalara bölme sabit olduğu için
  // aynı metinde aynı sıra numarası hep aynı cümleleri gösterir.
  async function* sentezle(text, speed = 0.95, seed = 0, baslangic = 0) {
    const temiz = AntaliaText.toModelText(text);
    if (!temiz) return;
    const parcalar = parcala(temiz);
    const STOI = AntaliaText.SYMBOL_TO_ID, enc = (s) => AntaliaText.encode(s);
    const low = new AntaliaAudio.Biquad(AntaliaAudio.TONE_LOW);
    const high = new AntaliaAudio.Biquad(AntaliaAudio.TONE_HIGH);
    let seedI = 0;

    for (let k = Math.max(0, baslangic); k < parcalar.length; k++) {
      const part = parcalar[k];
      const ilk = part.trim()[0];
      const onEkVar = Boolean(ilk && PREFIX_INITIALS.has(ilk));
      const ids = enc((onEkVar ? PREFIX : "") + part + SUFFIX);
      const L = ids.length;
      const nPre = onEkVar ? enc(PREFIX).length - 2 : 0;
      const nSuf = enc(SUFFIX).length - 2;

      // 1. Metin aşaması
      const tOut = await sessText.run({
        ids: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, L]),
        mask: new ort.Tensor("bool", new Uint8Array(L).fill(1), [1, L])
      });
      const dText = tOut.h.dims[2];
      const h = await tOut.h.getData();
      const logd = new Float32Array(await tOut.logd.getData());

      // Türkçe çift ünsüz uzatma
      const bosluk = STOI[" "];
      for (let i = 2; i < L - 1; i++) {
        if (ids[i] === ids[i - 1] && ids[i] !== bosluk) logd[i] += LOG_GEM;
        else if (ids[i - 1] === bosluk && ids[i] === ids[i - 2]) logd[i - 1] += LOG_GEM;
      }
      const dur = new Int32Array(L); let toplamKare = 0;
      for (let i = 0; i < L; i++) {
        dur[i] = Math.max(1, Math.min(MAX_DUR_FRAMES, Math.round(Math.exp(logd[i]) / speed)));
        toplamKare += dur[i];
      }
      const melLen = Math.ceil(toplamKare / STACK) * STACK;

      const cond = new Float32Array(melLen * dText);
      let f = 0;
      for (let i = 0; i < L; i++) {
        for (let r = 0; r < dur[i] && f < melLen; r++) {
          for (let j = 0; j < dText; j++) cond[f * dText + j] = h[i * dText + j];
          f++;
        }
      }
      while (f < melLen) { for (let j = 0; j < dText; j++) cond[f * dText + j] = h[(L - 1) * dText + j]; f++; }

      const noise = randn((melLen / STACK) * NOISE_DIM, mulberry32((seed * 1000003 + seedI++) >>> 0));
      for (let i = 0; i < noise.length; i++) noise[i] *= TEMPERATURE;

      // 2. Ses aşaması
      const sOut = await sessSound.run({
        cond: new ort.Tensor("float32", cond, [1, melLen, dText]),
        fmask: new ort.Tensor("bool", new Uint8Array(melLen).fill(1), [1, melLen]),
        noise: new ort.Tensor("float32", noise, [1, melLen / STACK, NOISE_DIM])
      });
      const mel = await sOut.mel.getData();

      // 3. Ses çözücü
      const dOut = await sessDec.run({ mel: new ort.Tensor("float32", mel, [1, N_MELS, melLen]) });
      const ham = new Float32Array(await dOut.audio.getData());

      // Ön/son ek seslerini kırp
      let say = 0, a = 0, b = ham.length;
      for (let i = 0; i < L; i++) {
        say += dur[i];
        if (i === nPre && onEkVar) a = say * HOP;
        if (i === L - 2 - nSuf) b = say * HOP;
      }
      const parca = ham.slice(Math.max(0, a), Math.min(ham.length, b));
      const fade = Math.floor(0.005 * RATE);
      if (parca.length > 2 * fade) {
        if (onEkVar) for (let i = 0; i < fade; i++) parca[i] *= i / fade;
        for (let i = 0; i < fade; i++) parca[parca.length - 1 - i] *= i / fade;
      }
      let cerceve = parca;
      if (k < parcalar.length - 1) {
        const ara = Math.round(AntaliaAudio.pauseSec(part) * RATE);
        cerceve = new Float32Array(parca.length + ara); cerceve.set(parca);
      }
      const audio = AntaliaAudio.postProcessAudio(cerceve, low, high);
      yield { audio, metin: part, sure: audio.length / RATE, sira: k + 1, toplam: parcalar.length };
    }
  }

  // 48 kHz mono Float32 → WAV (indirme için)
  function wavYap(orneklerListesi) {
    const n = orneklerListesi.reduce((t, a) => t + a.length, 0);
    const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const yaz = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    yaz(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); yaz(8, "WAVE"); yaz(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    yaz(36, "data"); v.setUint32(40, n * 2, true);
    let o = 44;
    for (const a of orneklerListesi) for (let i = 0; i < a.length; i++, o += 2) {
      const s = Math.max(-1, Math.min(1, a[i]));
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([buf], { type: "audio/wav" });
  }

  return { yukle, sentezle, wavYap, RATE, hazir: () => !!sessDec };
})();

if (typeof window !== "undefined") window.AiOkuma = AiOkuma;
