const CACHE = 'ppb-v5';
const ASSETS = [
  '/squish-pop/',
  '/squish-pop/index.html',
  '/squish-pop/style.css',
  '/squish-pop/js/storage.js',
  '/squish-pop/js/audio.js',
  '/squish-pop/js/collectibles.js',
  '/squish-pop/js/game.js',
  '/squish-pop/js/album.js',
  '/squish-pop/js/app.js',
  '/squish-pop/manifest.json',
  '/squish-pop/icons/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function networkFirst(request, fallbackKey) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
      if (fallbackKey) await cache.put(fallbackKey, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackKey) {
      const fallback = await cache.match(fallbackKey);
      if (fallback) return fallback;
    }
    throw err;
  }
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(e.request, '/squish-pop/index.html'));
    return;
  }

  e.respondWith(networkFirst(e.request));
});
