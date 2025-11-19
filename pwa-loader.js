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
            console.log('ServiceWorker registration successful');
        })
        .catch(err => {
            console.error('ServiceWorker registration failed: ', err);
            // ▼登録失敗時にアラートを出す（デバッグ用）
            // alert('SW登録エラー: ' + err.message); 
        });
}

// --- 2. 関数定義 ---

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission(); 
        return permission; 
    } catch (err) {
        console.error('通知許可エラー:', err);
        alert('通知許可のリクエスト中にエラーが発生しました。\n' + err.message);
        throw err; 
    }
}

async function getFcmToken(tokenArea, tokenInfo) { 
    const VAPID_KEY = "BC3eV001Pt3fT11KqKJQVGo95jq5DAuU64mJUtcR4Xa-oRhT6gaExcA_eri4AMc9IWvYicPLVcImAF4fU4MCwhk";

    if (!('serviceWorker' in navigator)) {
        alert("お使いのブラウザはService Workerに対応していません。");
        return;
    }

    try {
        // Service Worker が準備完了になるのを待つ
        // ※ここが一番止まりやすいポイントです
        const registration = await navigator.serviceWorker.ready; 
        
        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
        });

        if (currentToken) {
            // ★成功時のみエリアを表示
            if (tokenArea) {
                tokenArea.value = currentToken; 
                tokenArea.style.display = 'block';
            }
            if (tokenInfo) {
                tokenInfo.textContent = "表示されたトークンを開発者に連携してください。"; 
                tokenInfo.style.display = 'block';
            }
        } else {
            alert('トークンを取得できませんでした（空のトークンが返されました）。');
        }
    } catch (err) {
        console.error('トークン取得エラー:', err);
        // ▼エラー内容をアラートで表示
        alert('トークン取得エラー:\n' + err.message);
        
        if (tokenArea) {
            tokenArea.value = "エラー詳細: " + err.message;
            tokenArea.style.display = 'block';
        }
    }
}


// --- 3. 実行 ---
document.addEventListener('DOMContentLoaded', () => {
    
    const testBtn = document.getElementById('notification-test-btn');
    const tokenArea = document.getElementById('token-display-area');
    const tokenInfo = document.getElementById('token-info');

    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            // 初期化：エリアを隠す
            if (tokenArea) tokenArea.style.display = 'none';
            if (tokenInfo) tokenInfo.style.display = 'none';

            try {
                const permission = await requestNotificationPermission();
                
                if (permission === 'granted') {
                    await getFcmToken(tokenArea, tokenInfo); 
                } else {
                    alert('通知が許可されませんでした。\nブラウザの設定から通知を許可してください。');
                }
            } catch (err) {
                alert('予期せぬエラー:\n' + err.message);
            }
        });
    }
});
