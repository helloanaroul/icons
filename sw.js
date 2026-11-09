/* Solar Icons by Toolsax — Service Worker for Offline PWA */
const VERSION = 'v1.0.1';
const STATIC_CACHE = `solar-static-${VERSION}`;
const RUNTIME_CACHE = `solar-runtime-${VERSION}`;

// List of core files to cache for offline use
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/icons.js',
  '/icons.min.js',
  '/icons.json',
  '/site.webmanifest',
  '/browserconfig.xml',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// 1. Install Event - Save core files to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching offline assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Serve files from cache if offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  
  // Skip cross-origin requests (like Google Fonts or Tailwind CDN)
  if (url.origin !== self.location.origin) return;

  // Handle Page Navigation (HTML) -> Network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
          return res;
        })
        .catch(() => {
          console.log('[SW] Offline mode: serving page from cache');
          return caches.match(request).then(r => r || caches.match('/'));
        })
    );
    return;
  }

  // Handle Static Files (JS, CSS, Images) -> Cache first, then network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached; // Return from cache if found
      }
      
      // If not in cache, fetch from network and save for next time
      return fetch(request).then(res => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
        }
        return res;
      }).catch(() => {
        // If offline and not in cache, it will fail (which is fine for non-essential assets)
        console.log('[SW] Asset not found in cache and network is offline');
      });
    })
  );
});
