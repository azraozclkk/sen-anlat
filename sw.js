// Sen Anlat: arka plan yardımcısı (service worker).
// - Uygulama kapalıyken sunucudan gelen bildirimleri (arama, randevu) gösterir.
// - Bildirime dokununca uygulamayı açar ya da öne getirir.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let veri = {};
  try { const p = e.data ? e.data.json() : {}; veri = p.data || p; } catch { veri = { govde: e.data && e.data.text() }; }
  const baslik = veri.baslik || "Sen Anlat";
  const arama = veri.tur === "arama";
  e.waitUntil(self.registration.showNotification(baslik, {
    body: veri.govde || "Yeni bir bildirimin var.",
    icon: "ikon-192.png",
    badge: "ikon-192.png",
    tag: veri.etiket || undefined,
    renotify: true,
    requireInteraction: arama,           // arama bildirimi kullanıcı görene kadar kalır
    vibrate: arama ? [400, 200, 400, 200, 400] : [200, 100, 200],
    data: { url: "/" }
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((pencereler) =>
      pencereler.length ? pencereler[0].focus() : self.clients.openWindow("/")
    )
  );
});
