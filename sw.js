importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const CACHE_NAME = 'misechoku-mock-cache-v4'; // バージョン更新
const REPO_PATH = '/misechoku-mock/';

// ▼▼▼ 修正: アイコン画像のキャッシュを削除（ファイル名不一致によるエラー回避） ▼▼▼
const urlsToCache = [
  REPO_PATH + 'test.html',
  REPO_PATH + 'style.css',
  REPO_PATH + 'script.js',
  REPO_PATH + 'pwa-loader.js',
  REPO_PATH + 'manifest.json'
  // アイコンはキャッシュしなくてもアプリは動くため、一旦外します
];
// ▲▲▲ 修正ここまで ▲▲▲

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
             return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

const firebaseConfig = {
   apiKey: "AIzaSyAQnHBsjvhSKiJP6pq5Ac5317tweEU8Kk8",
   authDomain: "pwa-shindan-app.firebaseapp.com",
   projectId: "pwa-shindan-app",
   storageBucket: "pwa-shindan-app.firebasestorage.app",
   messagingSenderId: "680889712921",
   appId: "1:680889712921:web:4528445084a2d76ff44588",
   measurementId: "G-5Q243BKXZL"
 };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] 通知受信: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
    // icon指定も一旦省略（デフォルトアイコンを使用）
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 
  event.waitUntil(
    clients.openWindow(REPO_PATH + 'test.html')
  );
});
