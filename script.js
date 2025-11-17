document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素の取得 ---
    const mainMenu = document.getElementById('main-menu');
    const formScreen = document.getElementById('form-screen');
    const notificationScreen = document.getElementById('notification-screen');
    const swipeOverlay = document.getElementById('swipe-overlay');

    // --- メインメニューのボタン ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');

    // --- 各画面の「戻る」ボタン ---
    // (NodeList.forEach を使えるように Array.from で配列化)
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));

    // --- スワイプ関連 (既存のロジックを移植) ---
    let swiper = null; // Swiperインスタンス
    const closeSwipeBtn = document.getElementById('close-swipe-btn');

    // --- 画面切り替え関数 ---
    function showScreen(screenToShow) {
        // すべて非表示 (メインメニュー, フォーム, 通知)
        if (mainMenu) mainMenu.style.display = 'none';
        if (formScreen) formScreen.style.display = 'none';
        if (notificationScreen) notificationScreen.style.display = 'none';
        
        // 対象を表示
        if (screenToShow) {
            screenToShow.style.display = 'block';
            // 画面の先頭にスクロール
            window.scrollTo(0, 0);
        }
    }

    // --- イベントリスナー設定 ---

    // 1. 「スワイプイメージ」ボタン
    if (btnSwipeImage) {
        btnSwipeImage.addEventListener('click', () => {
            // オーバーレイを表示
            if (swipeOverlay) {
                swipeOverlay.style.display = 'block';
            }
            document.body.style.overflow = 'hidden';
            
            // Swiperを初期化 (まだなら)
            if (!swiper) { 
                swiper = new Swiper('.swiper', {
                    direction: 'vertical',
                    mousewheel: true,
                    grabCursor: true,
                });
            }
        });
    }
    
    // (スワイプを閉じるボタン)
    if (closeSwipeBtn) {
        closeSwipeBtn.addEventListener('click', () => {
            if (swipeOverlay) {
                swipeOverlay.style.display = 'none';
            }
            document.body.style.overflow = 'auto';
        });
    }

    // 2. 「フォームイメージ」ボタン
    if (btnFormImage) {
        btnFormImage.addEventListener('click', () => {
            showScreen(formScreen);
        });
    }

    // 3. 「通知テスト」ボタン (メインメニューの)
    if (btnNotificationScreen) {
        btnNotificationScreen.addEventListener('click', () => {
            showScreen(notificationScreen);
        });
    }
    
    // 4. 「メニューに戻る」ボタン (全画面共通)
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(mainMenu);
        });
    });

});