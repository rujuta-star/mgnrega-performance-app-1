const CACHE_NAME = 'mgnrega-dashboard-v1';
const RUNTIME_CACHE = 'mgnrega-runtime-v1';
const DATA_CACHE = 'mgnrega-data-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_NAME && 
                   name !== RUNTIME_CACHE && 
                   name !== DATA_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            console.log('[SW] Network failed, trying cache for:', url.pathname);
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                console.log('[SW] Serving from cache:', url.pathname);
                return cachedResponse;
              }
              return new Response(JSON.stringify({ 
                error: 'Data unavailable offline',
                message: 'Please check your internet connection'
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            });
          });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(request).then((response) => {
          if (response.ok && request.method === 'GET') {
            cache.put(request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
