const CACHE_NAME = 'conveyor-calc-v17'; // アップロード時はここを書き換える
const ASSETS = [
  './',
  './pitch.html',
  './manifest.json',
  './icon.png'
];

// インストール時に古いキャッシュを待たずに即時アクティブ化する
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting(); // ← これが「即交代」の命令です！
    })
  );
});

// アクティブ化した瞬間に、古いキャッシュを完全に削除して制御を奪う
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
      return self.clients.claim(); // ← これで即座に現在のページを新しいSWの支配下に置きます！
    })
  );
});

// キャッシュがあればそれを返し、なければネットワークから取得
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});