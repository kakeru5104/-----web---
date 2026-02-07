const CACHE_NAME = 'grad-live-v11'; 

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './image/icon.png',
];

// 1. インストール処理
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. 有効化処理
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// 3. 通信処理（ここを変更！ネットワーク優先）
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // まずネットに取りに行く
        fetch(event.request)
            .then((response) => {
                // 成功したら、その最新データをキャッシュにも保存しておく（次回オフライン用）
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // ネットが繋がらない時だけ、保存してあるキャッシュを使う
                return caches.match(event.request);
            })
    );
});