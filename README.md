# Sen Anlat

**Görme engelli üniversite öğrencilerini, o dersi bilen gönüllü öğrencilerle sesli olarak buluşturan akran destek uygulaması.**

🔗 Canlı demo: https://tangerine-puppy-f3b9bc.netlify.app

---

## Problem

2020 verilerine göre Türkiye'de 8 binden fazla görme engelli üniversite öğrencisi var. Bu öğrenciler tahtaya yazılanı göremiyor, PDF ders notlarını okuyamıyor. Ders çalışmak için sürekli bir arkadaşın, ailenin ya da engelli biriminin müsait olmasını bekliyorlar. Be My Eyes gibi genel amaçlı uygulamalarda ise karşılarına çıkan kişi çoğu zaman o dersi bilmiyor.

## Çözüm

Sen Anlat'ta öğrenci dersin adını yazıyor ya da sesle söylüyor. Uygulama onu, o dersi anlatabilen bir üniversite öğrencisiyle sesli görüşmede buluşturuyor.

## Özellikler

**Destek alan öğrenci için**
- 🎙️ **Sesle ders arama:** "liner cebir", "matematik bir" ya da "Kalkülüs 1" dense bile doğru ders bulunur.
- 🧠 **Akıllı ders eşleştirme:** Yazım hatalarına dayanıklı. Aynı içerikli ama farklı adlandırılmış dersleri (ör. *Doğrusal Cebir = Lineer Cebir*, *Kalkülüs I = Matematik I*) aynı ders sayar. Yaklaşık 1.350 ders tanıyor.
- 📅 **Randevu:** Gönüllünün müsait saatlerinden birini seçip randevu alma, takvime hatırlatmalı ekleme.
- 📞 **Anlık okuyucu araması:** Müsait bir metin okuma gönüllüsüne hemen bağlanma.
- 📄 **Belge paylaşımı:** Görüşme sırasında PDF ya da fotoğraf gönderme. Belgeler sunucuya yüklenmez, doğrudan karşı tarafa gider.
- 🔊 **Yapay zekâ ile PDF okuma:** Türkçe metin okuma (TTS) modeli tamamen cihazda çalışır. Okuma hızı ve sayfa aralığı seçilebilir. Matematik ağırlıklı metinlerde öğrenciyi gönüllüye yönlendirir.
- ⭐ **Değerlendirme:** Her dersten sonra gönüllüyü 5 yıldız üzerinden puanlama.

**Gönüllü için**
- Anlatabildiği dersleri ve müsait saatlerini seçme
- "Şu an müsaitim" ile anlık aramalara açılma
- Görüşme kaydına izin verip vermemeye kendisi karar verir; öğrenci bunu görerek katılır.

**Erişilebilirlik**
- Ekran okuyucu (VoiceOver / TalkBack) uyumlu yapı, ekran değişince odak başlığa taşınır
- Çalma, bağlanma ve bitiş için sesler ve titreşim
- Büyük yazı ve yüksek kontrast modu
- Düşük görme için tasarlanmış renkler ve okunaklı yazı tipi (Atkinson Hyperlegible)
- Engelli öğrenci panelinde yalnızca butonlar var, gereksiz yazı yok

**Güvenlik ve gizlilik**
- Yalnızca `.edu.tr` uzantılı, doğrulanmış e-postalarla giriş
- KVKK aydınlatma metni, açık rıza ve kullanım koşulları
- Görüşme kayıtları sunucuya yüklenmez, yalnızca cihazda saklanır ve 90 gün sonra silinir

## Teknolojiler

| Katman | Kullanılan |
|---|---|
| Arayüz | HTML, CSS, JavaScript (tek sayfa, framework yok), PWA |
| Kimlik doğrulama | Firebase Authentication (e-posta + doğrulama) |
| Veritabanı | Cloud Firestore |
| Sesli görüşme | WebRTC (sinyalleşme Firestore üzerinden) |
| Sesle arama | Web Speech API (tr-TR) |
| Yapay zekâ okuma | Antalia-2 Mini TTS (ONNX, onnxruntime-web) |
| PDF | pdf.js |
| Barındırma | Netlify |

Uygulama Firebase'in ücretsiz (Spark) planında çalışır.

## Dosya yapısı

```
index.html              Uygulamanın tamamı (arayüz + mantık)
ders-eslestirme.js      Akıllı ders eşleştirme (yazım hatası, sayı kelimeleri, eşdeğer dersler)
dersler.js              Üniversitelerde verilen ders listesi
ai-okuma.js             Cihaz içi Türkçe metin okuma motoru
normalize.js, audio.js  TTS yardımcıları (antalia-mini-web)
sw.js                   Service worker
manifest.webmanifest    PWA ayarları
firestore.rules         Firestore güvenlik kuralları
ikon-*.png              Uygulama ikonları
```

## Kurulum

1. [Firebase Console](https://console.firebase.google.com)'da bir proje oluşturun.
2. **Authentication → E-posta/Şifre** girişini açın.
3. **Firestore Database** oluşturun, `firestore.rules` içeriğini **Kurallar** sekmesine yapıştırın.
4. `index.html` içindeki `firebaseConfig` nesnesini kendi proje bilgilerinizle değiştirin.
5. Klasörü Netlify'a sürükleyip bırakın (ya da herhangi bir statik sunucuda açın).
6. Firebase → Authentication → Ayarlar → **Yetkili alan adları** kısmına sitenin adresini ekleyin.

Yeni ders eklemek için `dersler.js` içindeki ilgili alana `| Ders Adı` yazmanız yeterli. Eşdeğer ders grupları `ders-eslestirme.js` içindeki `GRUPLAR` listesindedir.

## Yol haritası

- [ ] Şikayet et ve engelle
- [ ] Uygulamadan hesap silme
- [ ] Görüntülü görüşme (tahtayı ya da kağıdı gösterme)
- [ ] Anlık aramalar için bekleme sırası
- [ ] Gönüllülere otomatik gönüllülük belgesi
- [ ] Güvenlik kurallarını görüşmenin taraflarına göre daraltma

## Lisans ve teşekkür

Yapay zekâ okuma özelliği [Antalia-2 Mini](https://huggingface.co/cloud0day3/antalia-mini) modelini ve [antalia-mini-web](https://github.com/fr0stb1rd/antalia-mini-web) projesini kullanır (Apache-2.0). Lisans ve bildirim metinleri `ANTALIA-LICENSE.txt` ve `ANTALIA-NOTICE.txt` dosyalarındadır.

---

Sakarya Üniversitesi hackathonu için geliştirilmiştir.
