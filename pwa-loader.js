// --- 1. 定義 ---
const REPO_PATH = '/misechoku-mock/';

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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(REPO_PATH + 'sw.js', { scope: REPO_PATH })
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
            console.error('ServiceWorker registration failed: ', err);
        });
}

// --- 2. 関数定義 ---

async function requestNotificationPermission() {
    console.log('通知の許可をリクエストします...');
    try {
        const permission = await Notification.requestPermission(); 
        return permission; 
    } catch (err) {
        console.error('通知許可リクエストエラー:', err);
        throw err; 
    }
}

async function getFcmToken(tokenArea, tokenInfo) { 
    const VAPID_KEY = "BC3eV001Pt3fT11KqKJQVGo95jq5DAuU64mJUtcR4Xa-oRhT6gaExcA_eri4AMc9IWvYicPLVcImAF4fU4MCwhk";

    if (!('serviceWorker' in navigator)) {
        if (tokenArea) tokenArea.value = "このブラウザはService Worker非対応です。";
        return;
    }

    try {
        // ★進捗表示 1
        if (tokenArea) tokenArea.value = "Service Workerの準備(Active)を待っています...\n(ここで止まる場合はリロードまたはキャッシュ削除を試してください)";
        
        // Service Worker がアクティブになるのを待つ (ここで止まりがち)
        const registration = await navigator.serviceWorker.ready; 
        console.log('Service Worker Ready:', registration);

        // ★進捗表示 2
        if (tokenArea) tokenArea.value = "Firebaseサーバーからトークンを取得しています...";

        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
        });

        if (currentToken) {
            // ★完了表示
            console.log('FCM Token:', currentToken);
            if (tokenArea) {
                tokenArea.value = currentToken; 
                tokenArea.style.display = 'block';
            }
            if (tokenInfo) {
                tokenInfo.textContent = "表示されたトークンを開発者に連携してください。"; 
                tokenInfo.style.display = 'block';
            }
        } else {
            console.warn('トークンがnullでした。');
            if (tokenArea) tokenArea.value = "トークンを取得できませんでした (null)。";
            if (tokenInfo) tokenInfo.style.display = 'none';
        }
    } catch (err) {
        console.error('トークン取得エラー:', err);
        if (tokenArea) {
            tokenArea.value = "エラーが発生しました:\n" + err.message;
            tokenArea.style.display = 'block';
        }
        if (tokenInfo) tokenInfo.style.display = 'none';
    }
}


// --- 3. 実行 ---
document.addEventListener('DOMContentLoaded', () => {
    
    const testBtn = document.getElementById('notification-test-btn');
    
    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            
            const tokenArea = document.getElementById('token-display-area');
            const tokenInfo = document.getElementById('token-info');

            // 初期表示
            if (tokenArea) {
                tokenArea.style.display = 'block';
                tokenArea.value = "処理を開始します...";
            }
            if (tokenInfo) tokenInfo.style.display = 'none';

            try {
                // 1. 許可リクエスト
                const permission = await requestNotificationPermission();

                if (permission === 'granted') {
                    // 2. トークン取得へ
                    await getFcmToken(tokenArea, tokenInfo); 
                } else {
                    if (tokenArea) tokenArea.value = "通知がブロックされています。\nブラウザの設定から通知を許可してください。";
                }
            } catch (err) {
                if (tokenArea) tokenArea.value = "予期せぬエラー: " + err.message;
            }
        });
    }
});
