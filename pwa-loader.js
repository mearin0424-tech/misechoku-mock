// --- 1. 定義 ---

// ★重要★ GitHub Pages (https://.../misechoku-mock/...) で動かす場合、
// このパスは '/misechoku-mock/' である必要があります。
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

// Service Workerの登録処理
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


// ▼▼▼ 修正 ▼▼▼
// 宛先ID（トークン）を取得する関数
async function getFcmToken() {
    const VAPID_KEY = "BC3eV001Pt3fT11KqKJQVGo95jq5DAuU64mJUtcR4Xa-oRhT6gaExcA_eri4AMc9IWvYicPLVcImAF4fU4MCwhk";

    // swRegistrationPromise ではなく、
    // Service Worker がアクティブになるのを待つ navigator.serviceWorker.ready を使う
    if (!('serviceWorker' in navigator)) {
        console.error("サービスワーカーがサポートされていません。");
        return;
    }

    try {
        // .ready を待つことで、アクティブなService Worker登録を取得
        const registration = await navigator.serviceWorker.ready; 

        console.log('アクティブな Service Worker 登録情報を取得:', registration);

        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration // .ready が返した registration を使う
        });

        if (currentToken) {
            console.log('FCM 宛先ID (トークン): ', currentToken);
            
            // テキストエリアにトークンを表示
            const tokenArea = document.getElementById('token-display-area');
            const tokenInfo = document.getElementById('token-info');
            
            if (tokenArea && tokenInfo) {
                tokenArea.value = currentToken;
                tokenArea.style.display = 'block';
                tokenInfo.style.display = 'block';
            }

        } else {
            console.log('トークンが取得できませんでした。');
        }
    } catch (err) {
        // ここで AbortError が発生していた
        console.error('トークンの取得中にエラーが発生しました。詳細:', err);
    }
}
// ▲▲▲ 修正ここまで ▲▲▲


// --- 3. 実行 ---
document.addEventListener('DOMContentLoaded', () => {
    
    const testBtn = document.getElementById('notification-test-btn');
    if (testBtn) {
        testBtn.addEventListener('click', async () => {
            try {
                // 1. まず許可をリクエスト
                const permission = await requestNotificationPermission();

                // 2. 許可された場合のみ、トークン取得を実行
                if (permission === 'granted') {
                    console.log('許可が得られたため、トークンを取得します。');
                    await getFcmToken(); 
                } else {
                    console.log('許可が得られなかったため、トークン取得を中止します。');
                }
            } catch (err) {
                console.error('通知許可またはトークン取得プロセスでエラー:', err);
            }
        });
    }
});