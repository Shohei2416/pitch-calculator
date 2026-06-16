const CACHE_NAME = 'conveyor-calc-v18'; // 必ず前と違うバージョン(v11など)にする
const ASSETS = [
  './',
  './pitch.html',
  './manifest.json',
  './icon.png'
];

// 新しいワーカーがインストールされたら、待機せずにすぐ有効化する
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting(); // ← これが古いワーカーを即座に退場させる命令です！
    })
  );
});

// 有効化されたら、即座に現在のページを支配下に置き、古いキャッシュを消す
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim(); // ← これで開いているページを即座に新システムに切り替えます！
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});