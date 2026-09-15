// Bu site gerçek bir service worker / çevrimdışı önbellek kullanmaz (bkz. src/app/manifest.ts —
// yalnızca "ana ekrana ekle" desteği var). Bu dosya kod tarafından hiçbir yerde register
// edilmez; tek amacı, bu adres için (başka bir proje/denemeden) daha önce kayıtlı kalmış
// olabilecek bir service worker'ı temizlemektir — tarayıcı periyodik güncelleme kontrolünde
// bu dosyayı çekerse kendini anında kaldırır ve tüm önbellekleri siler.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })(),
  );
});
