const CACHE_NAME = 'Website-v3'; // Naikkan versi cache
const urlsToCache = [
  // FIX: Hapus slash di depan untuk compatibility di sub-direktori (GitHub Pages)
  './', 
  'index.html',
  'contact.html',
  'about.html',
  'offline.html',
  'style.css',
  'install.js', // Pastikan install.js juga di-cache
  'app.js',     // Jika ada file app.js (diasumsikan ada)
  'icons/icon-192.png',
  'icons/icon-512.png',
  'foto/photo.jpg'
];


// Install event - cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache dibuka');
        // FIX: Menggunakan urlsToCache, BUKAN ASSETS_TO_CACHE
        return cache.addAll(urlsToCache); 
      })
      // Tambahkan catch di sini untuk debugging jika ada file 404
      .catch((error) => console.error('❌ Gagal meng-cache file. Cek path file di urlsToCache!', error))
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
            console.log('🗑 Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - strategi Cache First untuk aset, Network First untuk navigasi (opsional)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Navigasi (HTML pages): Network First, Fallback ke offline.html
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => caches.match("offline.html")) 
    );
  } else {
    // Aset (CSS, JS, Gambar): Cache First, Fallback ke Network
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});