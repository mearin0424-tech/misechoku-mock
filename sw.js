importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const CACHE_NAME = 'misechoku-mock-cache-v1';
const REPO_PATH = '/misechoku-mock/';

// ▼▼▼ 修正: 存在しない可能性のある画像をキャッシュ対象から除外 ▼▼▼
const urlsToCache = [
  REPO_PATH + 'test.html',
  REPO_PATH + 'style.css',
  REPO_PATH + 'script.js',
  REPO_PATH + 'pwa-loader.js',
  REPO_PATH + 'manifest.json',
  REPO_PATH + 'icons/icon-128x128.png',
  REPO_PATH + 'icons/icon-192x192.png',
  REPO_PATH + 'icons/hai-icon-512x512.png'
  // 以下の画像がサーバーに存在しないため、インストールが失敗していました。
  // REPO_PATH + 'images/misechoku-yoko.png',
  // REPO_PATH + 'images/card-1.png',
  // REPO_PATH + 'images/card-2.png',
  // REPO_PATH + 'images/card-3.png',
  // REPO_PATH + 'images/card-4.png'
];
// ▲▲▲ 修正ここまで ▲▲▲

// --- 1. インストール処理 ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        // 存在するものだけをキャッシュします
        return cache.addAll(urlsToCache); 
      })
      .then(() => {
        console.log('All essential files cached. Service Worker installing...');
        // インストールを即時アクティブ化（古いSWがいても待たない）
        return self.skipWaiting();
      })
  );
});

// --- 2. アクティベート処理 ---
// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // ページを即座に制御下に置く
      return self.clients.claim();
    })
  );
});


// --- 3. 通信傍受処理 ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればキャッシュから返す
        if (response) {
          return response; 
        }
        // キャッシュになければネットワークから取得
        return fetch(event.request); 
      })
  );
});

// --- 4. Firebase (プッシュ通知) 設定 ---
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

// バックグラウンドで通知を受け取ったときの処理
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] バックグラウンドで通知を受信しました: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: REPO_PATH + 'icons/icon-192x192.png'
  };

  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1).catch((err) => {
        console.error('バッジの設定に失敗:', err);
    });
  }
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知がクリックされたときの処理
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.js] 通知がクリックされました: ', event.notification);
  event.notification.close(); 
  
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch((err) => {
        console.error('バッジのクリアに失敗:', err);
    });
  }

  event.waitUntil(
    clients.openWindow(REPO_PATH + 'test.html')
  );
});
