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

// 通知の許可をリクエストする関数
async function requestNotificationPermission() {
    console.log('通知の許可をリクエストします...');
    try {
        const permission = await Notification.requestPermission(); 
        if (permission === 'granted') {
            console.log('通知の許可が得られました。');
        } else {
            console.log('通知の許可が得られませんでした。');
        }
        return permission; 
    } catch (err) {
        console.log('通知の許可リクエスト中にエラーが発生しました。', err);
        throw err; 
    }
}


// ▼▼▼ 修正: 引数で要素を受け取るように変更 ▼▼▼
async function getFcmToken(tokenArea, tokenInfo) {
    const VAPID_KEY = "BC3eV001Pt3fT11KqKJQVGo95jq5DAuU64mJUtcR4Xa-oRhT6gaExcA_eri4AMc9IWvYicPLVcImAF4fU4MCwhk";

    if (!('serviceWorker' in navigator)) {
        console.error("サービスワーカーがサポートされていません。");
        if (tokenArea) tokenArea.value = "サービスワーカー非対応です。";
        if (tokenInfo) tokenInfo.style.display = 'none';
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready; 
        console.log('アクティブな Service Worker 登録情報を取得:', registration);

        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
        });

        if (currentToken) {
            // ★リクエスト1: トークン表示
            console.log('FCM 宛先ID (トークン): ', currentToken);
            if (tokenArea) {
                tokenArea.value = currentToken; 
            }
            if (tokenInfo) {
                tokenInfo.textContent = "表示されたトークンを開発者に連携してください。"; 
                tokenInfo.style.display = 'block';
            }
        } else {
            // ★リクエスト1: 失敗フィードバック
            console.log('トークンが取得できませんでした。');
            if (tokenArea) {
                tokenArea.value = "トークンが取得できませんでした。ブラウザ設定を確認してください。";
            }
            if (tokenInfo) {
                tokenInfo.style.display = 'none';
            }
        }
    } catch (err) {
        // ★リクエスト1: エラーフィードバック
        console.error('トークンの取得中にエラーが発生しました。詳細:', err);
        if (tokenArea) {
            tokenArea.value = "トークン取得エラー: " + err.message;
        }
        if (tokenInfo) {
            tokenInfo.style.display = 'none';
        }
    }
}
// ▲▲▲ 修正ここまで ▲▲▲


// --- 3. 実行 ---
document.addEventListener('DOMContentLoaded', () => {
    
    // ▼▼▼ 修正:「トークン取得中...」のフィードバックを追加 ▼▼▼
    const testBtn = document.getElementById('notification-test-btn');
    const tokenArea = document.getElementById('token-display-area');
    const tokenInfo = document.getElementById('token-info');

    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            
            // ★リクエスト1: 先に表示して「取得中」をセット
            if (tokenArea) {
                tokenArea.value = "トークン取得中...";
                tokenArea.style.display = 'block';
            }
            if (tokenInfo) {
                tokenInfo.textContent = "ブラウザの許可を確認しています...";
                tokenInfo.style.display = 'block';
            }

            try {
                // 1. まず許可をリクエスト
                const permission = await requestNotificationPermission();

                // 2. 許可された場合のみ、トークン取得を実行
                if (permission === 'granted') {
                    console.log('許可が得られたため、トークンを取得します。');
                    if (tokenInfo) tokenInfo.textContent = "トークンを取得しています...";
                    
                    // ★リクエスト1: 取得した要素を渡す
                    await getFcmToken(tokenArea, tokenInfo); 
                } else {
                    console.log('許可が得られなかったため、トークン取得を中止します。');
                    if (tokenArea) tokenArea.value = "通知が許可されませんでした。";
                    if (tokenInfo) tokenInfo.style.display = 'none';
                }
            } catch (err) {
                console.error('通知許可またはトークン取得プロセスでエラー:', err);
                if (tokenArea) tokenArea.value = "エラーが発生しました: " + err.message;
                if (tokenInfo) tokenInfo.style.display = 'none';
            }
        });
    }
    // ▲▲▲ 修正ここまで ▲▲▲
});