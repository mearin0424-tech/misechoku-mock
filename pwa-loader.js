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
        console.error("Service Worker非対応");
        return;
    }

    try {
        // Service Worker がアクティブになるのを待つ
        const registration = await navigator.serviceWorker.ready; 
        
        // トークン取得
        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
        });

        if (currentToken) {
            console.log('FCM Token:', currentToken);
            
            // ★ここで初めて表示する
            if (tokenArea) {
                tokenArea.value = currentToken; 
                tokenArea.style.display = 'block';
            }
            if (tokenInfo) {
                tokenInfo.textContent = "表示されたトークンを開発者に連携してください。"; 
                tokenInfo.style.display = 'block';
            }
        } else {
            console.warn('トークンが取得できませんでした(null)');
        }
    } catch (err) {
        console.error('トークン取得エラー:', err);
        // エラー時はアラートを出すなどしても良いですが、今回はコンソールのみにします
    }
}


// --- 3. 実行 ---
document.addEventListener('DOMContentLoaded', () => {
    
    const testBtn = document.getElementById('notification-test-btn');
    const tokenArea = document.getElementById('token-display-area');
    const tokenInfo = document.getElementById('token-info');

    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            // ★クリック時はまず非表示にする（リトライ時などのため）
            if (tokenArea) tokenArea.style.display = 'none';
            if (tokenInfo) tokenInfo.style.display = 'none';

            try {
                const permission = await requestNotificationPermission();
                if (permission === 'granted') {
                    await getFcmToken(tokenArea, tokenInfo); 
                } else {
                    console.warn("通知が許可されませんでした。");
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
});
