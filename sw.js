const CACHE_NAME = 'htoo-myat-pos-cache-v3'; // Incremented version for update
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx', // Cache main script
];

// Install: Cache the app shell and take control immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force the waiting service worker to become the active service worker.
  );
});

// Activate: Clean up old caches and take control of clients
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open pages
  );
});

// Fetch: Intercept network requests
self.addEventListener('fetch', event => {
  // For navigation requests (HTML pages), always serve the app shell (index.html).
  // This is the key fix for Single Page Application 404 errors.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // For all other requests (scripts, images, etc.), use a "cache-first" strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we find it in cache, return it
        if (response) {
          return response;
        }

        // Otherwise, fetch from the network
        return fetch(event.request).then(
          networkResponse => {
            // Check for a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // We don't cache responses from CDNs (non-basic type) to avoid issues
            if (networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response and cache it for next time
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});