// キャッシュの名前（更新したらここを変える）
const CACHE_NAME = 'grad-live-v1';

// キャッシュするファイルリスト
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './image/icon.png'
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時の処理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す、なければネットワークへ
        return response || fetch(event.request);
      })
  );
});