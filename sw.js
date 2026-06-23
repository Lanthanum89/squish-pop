const CACHE = 'ppb-v2';
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

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
