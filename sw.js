const CACHE_NAME = 'takeitdoit-v2'; // Bump version number

self.addEventListener('install', (event) => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            // Delete old cache versions
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
