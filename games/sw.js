const CACHE_NAME = 'cant-stop-v2';
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
      // Cache files individually so one missing asset can't abort the whole install.
      return Promise.all(
        ASSETS.map(url => cache.add(url).catch(err => {
          console.log('Cache add failed for', url, err);
        }))
      );
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
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network, then to the cached app shell.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && response.type !== 'error') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return response;
    } catch (err) {
      const shell = await caches.match('/games/cant-stop/index.html');
      if (shell) return shell;
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
})
