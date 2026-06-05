const CACHE_NAME = 'cant-stop-v1';
const ASSETS = [
  '/games/cant-stop/',
  '/games/cant-stop/index.html',
  '/games/cant-stop/manifest.json',
  '/previews/cant-stop-preview.png'
];

// Install: cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.log('Cache addAll error:', err);
        // Continue even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if(cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) return response;
      
      return fetch(event.request).then(response => {
        // Cache successful responses
        if(!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // Return cached version if available, otherwise offline page
        return caches.match(event.request) || caches.match('/games/cant-stop/index.html');
      });
    })
  );
});
