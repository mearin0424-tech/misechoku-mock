importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const CACHE_NAME = 'misechoku-mock-cache-v1';

const REPO_PATH = '/misechoku-mock/';

const urlsToCache = [
  REPO_PATH + 'test.html',
  REPO_PATH + 'style.css',
  REPO_PATH + 'script.js',
  REPO_PATH + 'pwa-loader.js',
  REPO_PATH + 'manifest.json',
  REPO_PATH + 'icons/piyoko-icon-128x128.png',
  REPO_PATH + 'icons/icon-192x192.png',
  REPO_PATH + 'icons/hai-icon-512x512.png',
  REPO_PATH + 'images/misechoku-yoko.png',
  REPO_PATH + 'images/card-1.png',
  REPO_PATH + 'images/card-2.png',
  REPO_PATH + 'images/card-3.png',
  REPO_PATH + 'images/card-4.png'
];

// --- 1. インストール処理 ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- 2. 通信傍受処理 ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // キャッシュから返す
        }
        return fetch(event.request); // ネットワークから取得
      })
  );
});

// --- 3. Firebase (プッシュ通知) 設定 ---

// (設定は personality-test のものを流用)
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
    // ★修正★ アイコンパスを変更
    icon: REPO_PATH + 'icons/icon-192x192.png'
  };

  // アプリアイコンにバッジをセット
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1).catch((err) => {
        console.error('バッジの設定に失敗:', err);
    });
  }

  // 通知を表示
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 通知がクリックされたときの処理
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.js] 通知がクリックされました: ', event.notification);
  event.notification.close(); // 通知を閉じる
  
  // アプリアイコンのバッジをクリア
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch((err) => {
        console.error('バッジのクリアに失敗:', err);
    });
  }

  // ★修正★ クリックされたら misechoku-mock のHTMLを開く
  event.waitUntil(
    clients.openWindow(REPO_PATH + 'test.html')
  );
});
