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

let swRegistrationPromise = null;

if ('serviceWorker' in navigator) {
    swRegistrationPromise = navigator.serviceWorker.register(REPO_PATH + 'sw.js', { scope: REPO_PATH })
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            return registration; 
        })
        .catch(err => {
            console.error('ServiceWorker registration failed: ', err);
            return null; 
        });
}

// --- 2. 関数定義 ---

// ▼▼▼ 修正 ▼▼▼
// requestNotificationPermission 関数を async/await 構文に
async function requestNotificationPermission() {
    console.log('通知の許可をリクエストします...');
    try {
        // Notification.requestPermission() は Promise を返す
        const permission = await Notification.requestPermission(); 
        
        if (permission === 'granted') {
            console.log('通知の許可が得られました。');
        } else {
            console.log('通知の許可が得られませんでした。');
        }
        return permission; // 許可状態 ('granted', 'denied', 'default') を返す
    
    } catch (err) {
        console.log('通知の許可リクエスト中にエラーが発生しました。', err);
        throw err; // エラーを呼び出し元に投げる
    }
}
// ▲▲▲ 修正ここまで ▲▲▲


async function getFcmToken() {
    const VAPID_KEY = "BC3eV001Pt3fT11KqKJQVGo95jq5DAuU64mJUtcR4Xa-oRhT6gaExcA_eri4AMc9IWvYicPLVcImAF4fU4MCwhk";
    if (!swRegistrationPromise) {
        console.error("サービスワーカーがサポートされていないか、登録が開始されていません。");
        return;
    }
    try {
        const registration = await swRegistrationPromise; 
        if (!registration) {
            console.error('サービスワーカーの登録に失敗しているため、トークンを取得できません。');
            return;
        }
        const currentToken = await messaging.getToken({ 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
        });
        if (currentToken) {
            console.log('FCM 宛先ID (トークン): ', currentToken);
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
        console.error('トークンの取得中にエラーが発生しました。詳細:', err);
    }
}

// --- 3. 実行 ---

document.addEventListener('DOMContentLoaded', () => {
    
    // (起動時の自動リクエストは行わない)

    const testBtn = document.getElementById('notification-test-btn');
    if (testBtn) {
        // ▼▼▼ 修正 ▼▼▼ (ロジックは前回と同じだが、呼び出す関数(requestNotificationPermission)が堅牢になった)
        testBtn.addEventListener('click', async () => {
            try {
                // 1. まず許可をリクエスト (ポップアップが出る)
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
        // ▲▲▲ 修正ここまで ▲▲▲
    }
});