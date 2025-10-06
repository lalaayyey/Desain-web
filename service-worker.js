const CACHE_NAME = 'Wesbsite';
const urlsToCache = [
  './',
  'index.html',
  'contact.html',
  'about.html',
  'offline.html',
  'style.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/foto/WhatsApp Image 2025-09-14 at 22.17.15_bd57891d.jpg'
];

// Install event - cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - hapus cache lama
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

// Fetch event - strategi Cache First dengan Fallback ke Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response dari cache
        if (response) {
          return response;
        }

        // Clone request karena request adalah stream dan hanya bisa digunakan sekali
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Cek apakah response valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response karena response adalah stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Jika fetch gagal dan tidak ada di cache, tampilkan offline page
          return caches.match('/offline.html');
        });
      })
  );
});