const CACHE_NAME = 'Website-v2'; // versi cache baru
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/about.html',
  '/offline.html',
  '/style.css',
  '/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/foto/photo.jpg'
];

// service-worker.js - PERBAIKI BAGIAN INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        // UBAH DARI ASSETS_TO_CACHE MENJADI urlsToCache
        return cache.addAll(urlsToCache); 
      })
  );
  self.skipWaiting();
});

// ============================
// Activate Event - hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑 Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ============================
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // return dari cache
        return response;
      }

      // fetch dari network
      return fetch(event.request)
        .then((networkResponse) => {
          // validasi response
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // clone response untuk cache
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // fallback offline
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
