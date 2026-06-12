// pitch.htmlを修正したら、ここを「v3」「v4」と書き換えてアップロードする
const CACHE_NAME = 'conveyor-calc-v14'; 
const ASSETS = [
  './pitch.html',
  './manifest.json',
  './icon.png'
];

// インストール時にファイルをスマホに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// オフライン時はスマホ内のキャッシュからページを読み込む
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});