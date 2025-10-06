const CACHE_NAME = 'Website-v5-FINAL-FIXED'; // Versi cache baru
const urlsToCache = [
  // FIX: Hapus slash di depan untuk sub-direktori
  './', 
  'index.html',
  'contact.html',
  'about.html',
  'offline.html',
  'style.css',
  'install.js',
  'app.js', 
  'icons/icon-192.png',
  'icons/icon-512.png',
  'foto/photo.jpg' // Pastikan folder/file ini ada
];


// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        // FIX A: Ganti ke urlsToCache
        return cache.addAll(urlsToCache); 
      })
      // Tambahkan catch untuk debugging
      .catch((error) => console.error('❌ FATAL: Cache addAll gagal. Cek path!', error))
  );
  self.skipWaiting();
});

// Activate & Fetch Event (Bagian ini sudah benar)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match("offline.html")) // Path ke offline.html sudah relatif dan benar
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});