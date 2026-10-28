# 🎧 Sen Anlat

**Görme engelli üniversite öğrencilerinin, o dersi bilen başka bir öğrenciden sesli olarak ders dinleyebildiği ücretsiz bir uygulama.**

👉 **Uygulamayı dene:** https://tangerine-puppy-f3b9bc.netlify.app

---

## 🎯 Projenin Amacı

2020 verilerine göre Türkiye'de **8 binden fazla görme engelli üniversite öğrencisi** var.

Bu öğrenciler derste hocanın tahtaya yazdıklarını göremiyor, PDF ders notlarını okuyamıyor. Ders çalışmak istediklerinde bir arkadaşlarının ya da ailelerinin müsait olmasını beklemek zorunda kalıyorlar.

Bugün bu sorun genellikle şöyle çözülmeye çalışılıyor:
- Bir arkadaştan ya da aileden yardım istemek. Ama onlar her zaman müsait değil ve dersi bilmiyor olabilirler.
- Üniversitenin engelli birimine başvurmak. Ama bu birimlerin imkânları sınırlı.
- Be My Eyes gibi uygulamalar. Bunlar günlük işler için harika, ama karşınıza çıkan kişi büyük ihtimalle lineer cebir bilmiyor.

**Sen Anlat bu boşluğu dolduruyor:** Öğrenciyi, tam da o dersi bilen bir üniversite öğrencisiyle buluşturuyor.

---

## 💡 Nasıl çalışıyor?

Uygulamada iki tür kullanıcı var:

| 👤 Destek alan öğrenci | 🙋 Gönüllü öğrenci |
|---|---|
| Görme engelli üniversite öğrencisi | Ders anlatmak ya da metin okumak isteyen herhangi bir üniversite öğrencisi |
| Dersin adını söyler, kendisine uygun gönüllüyü seçer | Anlatabileceği dersleri ve boş saatlerini seçer |
| Randevu saatinde gönüllüyü sesli arar | Randevu saatinde gelen aramayı açar |

**Örnek:** Elif yarın Lineer Cebir sınavına girecek. Uygulamayı açıp "liner cebir" diyor. Uygulama, Lineer Cebir anlatabilen gönüllüleri puanlarıyla birlikte listeliyor. Elif, Ahmet'in akşam 8'deki boş saatine randevu alıyor. Saat gelince tek dokunuşla Ahmet'i arıyor ve Ahmet ona konuyu anlatıyor. Ders bitince Elif, Ahmet'i 5 yıldız üzerinden puanlıyor.

---

## ✨ Neler yapabiliyor?

### Destek alan öğrenci için

- **🎙️ Sesle ders arama:** Dersin adını yazmak zorunda değil, söylemesi yeterli.
- **🧠 Akıllı ders bulma:** Uygulama yanlış yazılmış ya da farklı söylenmiş ders adlarını da anlıyor:
  - "liner cebir" → **Lineer Cebir**
  - "matematik bir" → **Matematik I**
  - Aynı dersin farklı adlarını da tanıyor: *Doğrusal Cebir* ile *Lineer Cebir*, *Kalkülüs I* ile *Matematik I* aynı ders sayılıyor.
  - Yaklaşık **1.350 üniversite dersi** tanıyor.
- **📅 Randevu alma:** Gönüllünün boş saatlerinden birini seçiyor. Randevuyu tek dokunuşla telefonun takvimine hatırlatmalı olarak ekleyebiliyor.
- **📞 Hemen okuyucu bulma:** Okunması gereken bir metin varsa, o an müsait olan bir gönüllüye hemen bağlanabiliyor.
- **📄 Belge gönderme:** Görüşme sırasında gönüllüye PDF ya da fotoğraf gönderebiliyor (ör. ödev kağıdının fotoğrafı).
- **🔊 Yapay zekâya PDF okutma:** Kimseyi beklemeden PDF'ini yapay zekâya sesli okutabiliyor. Hangi sayfalar arasının okunacağını ve okuma hızını kendisi seçiyor. Metin matematik formülleriyle doluysa, uygulama "bunu bir gönüllünün anlatması daha iyi olur" diyerek onu gönüllüye yönlendiriyor.
- **🕘 Geçmiş dersler:** Daha önce aldığı dersleri görebiliyor. Gönüllü izin verdiyse dersin ses kaydını tekrar dinleyebiliyor.
- **⭐ Puanlama:** Her dersten sonra gönüllüyü puanlıyor. En yüksek puanlı gönüllüler listede en üstte çıkıyor.

### Gönüllü için

- Anlatabileceği dersleri yazarak ya da sesle seçiyor.
- Haftalık boş saatlerini işaretliyor. Öğrenciler sadece bu saatlere randevu alabiliyor.
- İsterse metin okuma gönüllüsü de oluyor.
- "Şu an müsaitim" düğmesini açarak randevusuz gelen aramaları da alabiliyor.
- Derslerinin kaydedilip kaydedilmeyeceğine kendisi karar veriyor. Öğrenci bunu görerek o gönüllüyü seçip seçmeyeceğine karar veriyor.

---

## ♿ Erişilebilirlik

Uygulama baştan görme engelli kullanıcılar düşünülerek tasarlandı:

- **Ekran okuyucu uyumlu:** Telefonların sesli okuma özellikleriyle (iPhone'da VoiceOver, Android'de TalkBack) kullanılabiliyor. Her ekran açıldığında ekran okuyucu o ekranın adını söylüyor.
- **Sesli ve titreşimli geri bildirim:** Arama çalarken, bağlanınca ve görüşme bitince farklı sesler çalıyor, telefon titreşiyor.
- **Sade ekran:** Engelli öğrencinin ana ekranında yalnızca butonlar var. Ekran okuyucunun gereksiz yazılar okuyup zaman kaybettirmesi önleniyor.
- **Az gören kullanıcılar için:** Büyük yazı modu, yüksek kontrast modu, iyi ayırt edilen renkler ve özellikle az gören kişiler için tasarlanmış bir yazı tipi (Atkinson Hyperlegible).
- **Görüşme sırasında sessizlik:** Ekran okuyucu, görüşme sırasında sadece önemli bildirimleri okuyor, konuşmayı bölmüyor.

---

## 🔒 Güvenlik ve gizlilik

- **Sadece üniversite öğrencileri:** Kayıt için `.edu.tr` ile biten bir üniversite e-postası gerekiyor ve bu e-postanın doğrulanması şart.
- **Ses kayıtları telefonda kalıyor:** Kayıtlar hiçbir sunucuya yüklenmiyor, sadece görüşen kişilerin kendi telefonunda saklanıyor ve 90 gün sonra otomatik siliniyor. Kayıt yapılırken ekranda her zaman gösteriliyor.
- **Belgeler sunucuya gitmiyor:** Görüşmede gönderilen PDF ve fotoğraflar doğrudan karşı tarafın telefonuna gidiyor.
- **Yapay zekâ telefonda çalışıyor:** PDF okuyan yapay zekâ metni hiçbir yere göndermiyor, her şey kullanıcının cihazında oluyor.
- **KVKK:** Kayıt sırasında aydınlatma metni, açık rıza metni ve kullanım koşulları gösteriliyor ve onaylatılıyor.

---

## 💸 Tamamen ücretsiz

Uygulama hem kullanıcılar için hem de bizim için ücretsiz çalışıyor. Firebase'in ücretsiz planı ve Netlify'ın ücretsiz barındırma hizmeti kullanılıyor. Yapay zekâ telefonda çalıştığı için yapay zekâ hizmetlerine de ücret ödenmiyor.

---

## 🚀 İleride eklemek istediklerimiz

- **Şikayet etme ve engelleme:** Öğrenci, kötü davranan bir gönüllüyü şikayet edebilecek ve onunla bir daha eşleşmeyecek.
- **Hesabı silme:** Kullanıcı hesabını ve tüm bilgilerini tek dokunuşla silebilecek (KVKK'nın tanıdığı bir hak).
- **Görüntülü görüşme:** Öğrenci telefonunun kamerasını açıp gönüllüye tahtayı ya da elindeki kağıdı gösterebilecek.
- **Bekleme sırası:** Hemen yardım istendiğinde müsait gönüllü yoksa, öğrenci sıraya girecek ve ilk boşalan gönüllü onu arayacak.
- **Gönüllülük belgesi:** Gönüllülere, verdikleri ders saatlerini gösteren bir belge otomatik olarak hazırlanacak.
- **Daha sıkı veri koruması:** Bir randevunun ya da aramanın bilgilerini sadece o görüşmedeki iki kişi görebilecek ve değiştirebilecek.

---

## 🛠️ Kullanılan Teknolojiler

| Ne için? | Ne kullanıldı? |
|---|---|
| Uygulamanın kendisi | HTML, CSS, JavaScript. Telefona uygulama gibi yüklenebiliyor (PWA). |
| Giriş ve e-posta doğrulama | Firebase Authentication |
| Kullanıcı, randevu ve arama bilgileri | Firebase Firestore |
| Sesli görüşme | WebRTC (iki telefonu doğrudan birbirine bağlıyor) |
| Sesle ders arama | Tarayıcının Türkçe konuşma tanıma özelliği |
| Akıllı ders bulma | Kendi yazdığımız benzerlik algoritması ve eşdeğer ders listesi |
| PDF'i sesli okuma | Antalia-2 Mini Türkçe ses modeli (telefonda çalışıyor) |
| PDF okuma | pdf.js |
| Yayınlama | Netlify |

---

## 📁 Dosyalar ne işe yarıyor?

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulamanın tamamı: ekranlar, tasarım ve çalışma mantığı |
| `ders-eslestirme.js` | Yanlış yazılmış ya da farklı adlı dersleri tanıyan akıllı arama |
| `dersler.js` | Uygulamanın tanıdığı üniversite dersleri listesi |
| `ai-okuma.js` | PDF'i sesli okuyan yapay zekâ |
| `normalize.js`, `audio.js` | Yapay zekâ okumasının yardımcı dosyaları |
| `firestore.rules` | Veritabanını kimlerin okuyup yazabileceğini belirleyen kurallar |
| `sw.js`, `manifest.webmanifest` | Uygulamanın telefona yüklenebilmesi için gerekli dosyalar |
| `ikon-192.png`, `ikon-512.png`, `apple-touch-icon.png` | Uygulama simgeleri |
| `ANTALIA-LICENSE.txt`, `ANTALIA-NOTICE.txt` | Kullanılan yapay zekâ modelinin lisans metinleri |

---

## ⚙️ Nasıl Çalıştırılır?

**Hazır sürümü denemek için:** https://tangerine-puppy-f3b9bc.netlify.app adresini telefonda ya da bilgisayarda aç. `.edu.tr` uzantılı üniversite e-postanla kayıt ol, e-postana gelen bağlantıyla hesabını doğrula ve giriş yap. Ses ve mikrofon için en iyi sonucu Chrome ya da Safari'de alırsın.

**Kendi sürümünü kurmak için:**

1. [Firebase](https://console.firebase.google.com)'da ücretsiz bir proje oluştur.
2. **Authentication** kısmında "E-posta/Şifre" ile girişi aç.
3. **Firestore Database** oluştur. **Kurallar** sekmesine `firestore.rules` dosyasının içeriğini yapıştırıp yayınla.
4. `index.html` dosyasında `firebaseConfig` yazan yeri bul ve kendi Firebase projenin bilgilerini yaz.
5. Klasörü [Netlify Drop](https://app.netlify.com/drop) sayfasına sürükleyip bırak. Site birkaç saniyede yayına girer.
6. Firebase'de **Authentication → Ayarlar → Yetkili alan adları** kısmına Netlify'ın verdiği site adresini ekle.

**Yeni ders eklemek:** `dersler.js` dosyasında uygun alana `| Ders Adı` yazman yeterli.
**Aynı içerikli dersleri eşleştirmek:** `ders-eslestirme.js` dosyasındaki `GRUPLAR` listesine yeni bir satır ekle. Örneğin: `["Lineer Cebir", "Doğrusal Cebir"]`.

---

## 👥 Ekip

| Ad Soyad | Bölüm | Görev |
|---|---|---|
| Azra Özçelik | Veri Bilimi ve Analitiği, Sakarya Üniversitesi | [GÖREV] |
| [AD SOYAD] | [BÖLÜM] | [GÖREV] |

---

## 🙏 Teşekkür

PDF okuma özelliğinde [Antalia-2 Mini](https://huggingface.co/cloud0day3/antalia-mini) Türkçe ses modeli ve [antalia-mini-web](https://github.com/fr0stb1rd/antalia-mini-web) projesi kullanıldı (Apache-2.0 lisansı).

---

*Sakarya Üniversitesi hackathonu için geliştirildi.*
