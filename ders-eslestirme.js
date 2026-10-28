/* Sen Anlat: akıllı ders eşleştirme.
 *
 * Ders adlarını yazım farkından, sesli yazdırma hatasından ve farklı adlandırmadan bağımsız eşleştirir:
 *  - Büyük/küçük harf, Türkçe karakter, noktalama:  "LİNEER  cebir" = "lineer cebir"
 *  - Sayılar ve sayı kelimeleri:                     "Matematik 1" = "Matematik bir" = "Matematik I"
 *  - Yazım ve ses tanıma hataları (benzerlik):       "liner cebir" ≈ "Lineer Cebir"
 *  - Aynı içerikli farklı adlar (eşdeğer gruplar):  "Doğrusal Cebir" ≡ "Lineer Cebir" ≡ "Linear Algebra"
 *  - Seviye korunur:                                 "Matematik I" ≠ "Matematik II"
 *
 * Tamamen cihazda çalışır; internet, sunucu ya da ücret gerektirmez.
 */
"use strict";

const DersEslestirme = (() => {
  const SAYI_KELIME = { bir: "i", iki: "ii", uc: "iii", dort: "iv", one: "i", two: "ii", three: "iii", four: "iv" };
  const SEVIYELER = new Set(["i", "ii", "iii", "iv"]);

  function norm(ad) {
    return String(ad || "").toLocaleLowerCase("tr")
      .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[âà]/g, "a").replace(/[îì]/g, "i").replace(/[ûù]/g, "u")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\b4\b/g, "iv").replace(/\b3\b/g, "iii").replace(/\b2\b/g, "ii").replace(/\b1\b/g, "i")
      .split(/\s+/).filter(Boolean)
      .map(k => SAYI_KELIME[k] || k)
      .join(" ");
  }

  // Aynı içeriğe sahip, farklı adlandırılmış dersler. Her satır bir grup; ilk ad gösterilen addır.
  const GRUPLAR = [
    ["Matematik I", "Genel Matematik I", "Kalkülüs I", "Calculus I", "Analiz I", "Temel Matematik I", "Mühendislik Matematiği I"],
    ["Matematik II", "Genel Matematik II", "Kalkülüs II", "Calculus II", "Analiz II", "Temel Matematik II", "Mühendislik Matematiği II"],
    ["Lineer Cebir", "Doğrusal Cebir", "Linear Algebra", "Matris Cebiri", "Lineer Cebir ve Uygulamaları"],
    ["Ayrık Matematik", "Kesikli Matematik", "Discrete Mathematics", "Ayrık Yapılar"],
    ["Diferansiyel Denklemler", "Adi Diferansiyel Denklemler", "Differential Equations"],
    ["Sayısal Analiz", "Sayısal Yöntemler", "Nümerik Analiz", "Numerical Analysis", "Numerical Methods"],
    ["Olasılık", "Olasılık Teorisi", "Olasılık Kuramı", "Probability", "Probability Theory"],
    ["İstatistik", "İstatistiğe Giriş", "Temel İstatistik", "Statistics", "İstatistik I"],
    ["Olasılık ve İstatistik", "Mühendisler için Olasılık ve İstatistik", "Probability and Statistics"],
    ["Fizik I", "Genel Fizik I", "Physics I", "Temel Fizik I"],
    ["Fizik II", "Genel Fizik II", "Physics II", "Temel Fizik II"],
    ["Genel Kimya", "Kimya", "General Chemistry", "Temel Kimya"],
    ["Programlamaya Giriş", "Programlamaya Giriş (Python)", "Algoritma ve Programlama", "Temel Programlama", "Bilgisayar Programlama", "Introduction to Programming", "Programlama Temelleri"],
    ["Nesneye Dayalı Programlama", "Nesne Yönelimli Programlama", "Object Oriented Programming", "Nesne Tabanlı Programlama"],
    ["Veri Yapıları", "Veri Yapıları ve Algoritmalar", "Data Structures", "Data Structures and Algorithms"],
    ["Algoritma Analizi", "Algoritma Tasarımı ve Analizi", "Algorithm Analysis", "Algoritmalar"],
    ["Veritabanı Yönetim Sistemleri", "Veritabanı Sistemleri", "Veri Tabanı Yönetim Sistemleri", "Veritabanı", "Database Systems", "Database Management Systems"],
    ["İşletim Sistemleri", "Operating Systems"],
    ["Bilgisayar Ağları", "Ağ Teknolojileri", "Computer Networks", "Veri İletişimi ve Bilgisayar Ağları"],
    ["Mantık Devreleri", "Sayısal Tasarım", "Lojik Devreler", "Digital Logic Design", "Sayısal Elektronik"],
    ["Bilgisayar Organizasyonu", "Bilgisayar Mimarisi", "Computer Architecture", "Computer Organization"],
    ["Yazılım Mühendisliği", "Software Engineering"],
    ["Yapay Zekâ", "Yapay Zeka", "Artificial Intelligence", "Yapay Zekaya Giriş"],
    ["Makine Öğrenmesi", "Makine Öğrenimi", "Machine Learning", "Makine Öğrenmesine Giriş"],
    ["Derin Öğrenme", "Deep Learning"],
    ["Veri Madenciliği", "Data Mining"],
    ["Veri Görselleştirme", "Data Visualization"],
    ["Doğal Dil İşleme", "Natural Language Processing"],
    ["Bilgisayar Görmesi", "Bilgisayarlı Görü", "Computer Vision", "Görüntü İşleme"],
    ["Mikro İktisat", "Mikroekonomi", "Microeconomics", "Mikro Ekonomi"],
    ["Makro İktisat", "Makroekonomi", "Macroeconomics", "Makro Ekonomi"],
    ["İktisada Giriş", "Ekonomiye Giriş", "İktisat", "Introduction to Economics", "Genel Ekonomi"],
    ["Ekonometri", "Econometrics", "Ekonometriye Giriş"],
    ["Genel Muhasebe", "Finansal Muhasebe", "Muhasebe I", "Muhasebeye Giriş", "Financial Accounting"],
    ["Maliyet Muhasebesi", "Cost Accounting"],
    ["Pazarlama İlkeleri", "Pazarlama Yönetimi", "Temel Pazarlama", "Pazarlamaya Giriş", "Principles of Marketing"],
    ["İşletmeye Giriş", "İşletme Bilimine Giriş", "Introduction to Business", "Genel İşletme"],
    ["Finansal Yönetim", "Finansal Yönetim I", "İşletme Finansı", "Financial Management"],
    ["Örgütsel Davranış", "Organizational Behavior", "Örgüt Psikolojisi"],
    ["Yöneylem Araştırması I", "Yöneylem Araştırması", "Operations Research", "Doğrusal Programlama"],
    ["Hukuk Başlangıcı", "Hukukun Temel Kavramları", "Hukuka Giriş", "Temel Hukuk"],
    ["Borçlar Hukuku Genel", "Borçlar Hukuku", "Borçlar Hukuku Genel Hükümler"],
    ["Ceza Hukuku Genel", "Ceza Hukuku", "Ceza Hukuku Genel Hükümler"],
    ["Psikolojiye Giriş", "Genel Psikoloji", "Introduction to Psychology", "Psikoloji"],
    ["Sosyolojiye Giriş", "Genel Sosyoloji", "Sosyoloji", "Introduction to Sociology"],
    ["Araştırma Yöntemleri", "Bilimsel Araştırma Yöntemleri", "Bilimsel Araştırma Teknikleri", "Research Methods"],
    ["Türk Dili", "Türk Dili I", "Türk Dili ve Edebiyatı I", "Türkçe"],
    ["Atatürk İlkeleri ve İnkılap Tarihi", "İnkılap Tarihi", "Atatürk İlkeleri ve İnkılap Tarihi I", "AİİT"],
    ["İngilizce", "İngilizce I", "Yabancı Dil", "English", "Temel İngilizce"],
    ["Termodinamik", "Termodinamik I", "Thermodynamics"],
    ["Statik", "Mühendislik Mekaniği Statik", "Statics"],
    ["Dinamik", "Mühendislik Mekaniği Dinamik", "Dynamics"],
    ["Mukavemet", "Mukavemet I", "Strength of Materials", "Cisimlerin Mukavemeti"],
    ["Devre Analizi", "Devre Teorisi", "Elektrik Devreleri", "Circuit Analysis", "Elektrik Devre Temelleri"]
  ];

  // ---------- Benzerlik ----------
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let onceki = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const simdi = [i];
      for (let j = 1; j <= b.length; j++) {
        simdi[j] = Math.min(onceki[j] + 1, simdi[j - 1] + 1, onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      onceki = simdi;
    }
    return onceki[b.length];
  }
  const kelimeBenzerlik = (a, b) => 1 - levenshtein(a, b) / Math.max(a.length, b.length);

  // "matematik ii" → { taban: "matematik", seviye: "ii" }
  function ayir(n) {
    const k = n.split(" ");
    const son = k[k.length - 1];
    return SEVIYELER.has(son) && k.length > 1 ? { taban: k.slice(0, -1).join(" "), seviye: son } : { taban: n, seviye: "" };
  }
  // Seviyeler çelişmiyorsa (biri yoksa ya da aynıysa) uyumludur
  const seviyeUyumlu = (a, b) => !a.seviye || !b.seviye || a.seviye === b.seviye;

  // Sorgunun her kelimesi için dersteki en iyi eşleşen kelime (yarım yazılan kelime başı tam sayılır)
  function kelimeSkoru(qTaban, dTaban, yarimIzinli) {
    const qk = qTaban.split(" "), dk = dTaban.split(" ");
    let toplam = 0;
    for (const q of qk) {
      let en = 0;
      for (const d of dk) {
        let s = kelimeBenzerlik(q, d);
        if (yarimIzinli && q.length >= 2 && d.startsWith(q)) s = 1;
        if (s > en) en = s;
      }
      toplam += en;
    }
    const kapsam = toplam / qk.length;
    // Dersin fazladan kelimeleri skoru biraz düşürür ("cebir" ≠ "lineer cebir ve uygulamaları" kadar güçlü değil)
    return kapsam - Math.max(0, dk.length - qk.length) * 0.04;
  }

  // İki ders adı ne kadar benziyor (0-1)
  function benzerlik(a, b, yarimIzinli = false) {
    const na = norm(a), nb = norm(b);
    if (!na || !nb) return 0;
    if (na === nb) return 1;
    const A = ayir(na), B = ayir(nb);
    if (!seviyeUyumlu(A, B)) return 0;
    const tam = kelimeBenzerlik(A.taban, B.taban);
    return Math.max(tam, kelimeSkoru(A.taban, B.taban, yarimIzinli));
  }

  // ---------- Eşdeğer gruplar ----------
  const grupHaritasi = new Map(); // norm → grup no
  GRUPLAR.forEach((g, i) => g.forEach(ad => grupHaritasi.set(norm(ad), i)));

  const grupOnbellek = new Map(); // aynı ad için hesabı tekrarlamamak (binlerce ders hızlı aransın)
  function grubu(ad, esik = 0.86) {
    const n = norm(ad);
    if (grupHaritasi.has(n)) return grupHaritasi.get(n);
    const anahtar = n + "|" + esik;
    if (grupOnbellek.has(anahtar)) return grupOnbellek.get(anahtar);
    const sonuc = grubuHesapla(n, esik);
    grupOnbellek.set(anahtar, sonuc);
    return sonuc;
  }
  function grubuHesapla(n, esik) {
    let en = -1, enSkor = esik;
    const N = ayir(n);
    grupHaritasi.forEach((i, uye) => {
      if (ayir(uye).seviye !== N.seviye) return; // "Matematik" ne Matematik I'e ne II'ye atanır
      const s = benzerlik(n, uye);
      if (s >= enSkor) { enSkor = s; en = i; }
    });
    return en >= 0 ? en : null;
  }

  // İki ders aynı ders sayılır mı? (yazım hatası, sayı yazımı ve eşdeğer adlar dahil)
  function ayniDers(a, b) {
    if (norm(a) === norm(b)) return true;
    const A = ayir(norm(a)), B = ayir(norm(b));
    const ga = grubu(a), gb = grubu(b);
    if (ga !== null && ga === gb) return true;
    if (ga !== null && gb !== null && ga !== gb) return false; // farklı bilinen dersler
    return A.seviye === B.seviye && benzerlik(a, b) >= 0.86;
  }

  // Arama: sorguya en uygun dersler (yazım hatasına, sesli yazdırmaya ve eşdeğer adlara dayanıklı)
  function ara(sorgu, havuz, { haric = () => false, enFazla = 8 } = {}) {
    const q = norm(sorgu);
    if (!q) return [];
    const qGrup = q.length >= 4 ? grubu(sorgu, 0.8) : null;
    const Q = ayir(q);
    const sonuc = [];
    for (const d of havuz) {
      if (haric(d)) continue;
      const n = norm(d);
      if (Q.seviye && !seviyeUyumlu(Q, ayir(n))) continue; // "Matematik 1" araması "Matematik II" getirmez
      const Dv = ayir(n);
      let s = n.includes(q) ? (n.startsWith(q) ? 1 : 0.95) : benzerlik(sorgu, d, true);
      if (Q.seviye && !Dv.seviye) s *= 0.85;          // seviyesi yazılan aramada seviyeli ders öne çıkar
      sonuc.push({ d, s, g: grupHaritasi.get(n) });
    }
    // Aynı içerikli farklı adlar, gruptaki en iyi eşleşmenin hemen arkasında listelenir
    const grupEnIyi = new Map();
    sonuc.forEach(x => { if (x.g !== undefined && x.s > (grupEnIyi.get(x.g) ?? 0)) grupEnIyi.set(x.g, x.s); });
    if (qGrup !== null && !grupEnIyi.has(qGrup)) grupEnIyi.set(qGrup, 0.9);
    sonuc.forEach(x => { if (x.g !== undefined && grupEnIyi.has(x.g)) x.s = Math.max(x.s, grupEnIyi.get(x.g) - 0.01); });
    for (let i = sonuc.length - 1; i >= 0; i--) if (sonuc[i].s < 0.72) sonuc.splice(i, 1);
    sonuc.sort((x, y) => y.s - x.s || x.d.localeCompare(y.d, "tr"));
    return sonuc.slice(0, enFazla).map(x => x.d);
  }

  // Havuzdaki en yakın tek ders (yoksa null): elle yazılanı listedeki adla kaydetmek için
  function enYakin(ad, havuz, esik = 0.86) {
    let en = null, enSkor = 0;
    for (const d of havuz) {
      if (!ayniDers(ad, d)) continue;
      const s = benzerlik(ad, d);
      if (s > enSkor || en === null) { en = d; enSkor = s; }
    }
    return en;
  }

  const tumDersler = () => GRUPLAR.flat();

  return { norm, benzerlik, ayniDers, ara, enYakin, grubu, tumDersler };
})();

if (typeof module !== "undefined" && module.exports) module.exports = DersEslestirme;
else if (typeof window !== "undefined") window.DersEslestirme = DersEslestirme;
