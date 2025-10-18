const CACHE_NAME = 'htoo-myat-pos-cache-v4'; // Incremented version for critical update
const APP_SHELL_URL = '/index.html';

// Essential files for the app to load initially.
const urlsToCache = [
  '/',
  APP_SHELL_URL,
  '/manifest.json'
];

// Install: Cache the app shell and critical assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the new service worker to become active immediately.
        return self.skipWaiting();
      })
  );
});

// Activate: Clean up old caches and take control of the page.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all open clients (pages) immediately.
      return self.clients.claim();
    })
  );
});

// Fetch: Intercept network requests.
self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests (loading a page), ALWAYS serve the app shell.
  // This is the definitive fix for SPA routing issues in PWAs.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(APP_SHELL_URL).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback to network if the app shell isn't in the cache for some reason.
        return fetch(APP_SHELL_URL);
      })
    );
    return;
  }

  // For all other requests (scripts, images, etc.), use a "cache-first" strategy.
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // If we have a response in the cache, use it.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from the network.
      return fetch(request).then(networkResponse => {
        // We only cache valid, basic responses (not from opaque CDNs).
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response and add it to the cache for next time.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
