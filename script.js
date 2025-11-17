document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素の取得 ---
    const mainMenu = document.getElementById('main-menu');
    const formScreen = document.getElementById('form-screen');
    const notificationScreen = document.getElementById('notification-screen');
    const swipeOverlay = document.getElementById('swipe-overlay');
    
    const backToTopBtn = document.getElementById('btn-back-to-top');

    // --- メインメニューのボタン ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');

    // --- 各画面の「戻る」ボタン ---
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));

    // --- スワイプ関連 ---
    let swiper = null; // Swiperインスタンス
    const closeSwipeBtn = document.getElementById('close-swipe-btn');

    // --- 画面切り替え関数 ---
    function showScreen(screenToShow) {
        // すべて非表示
        if (mainMenu) mainMenu.style.display = 'none';
        if (formScreen) formScreen.style.display = 'none';
        if (notificationScreen) notificationScreen.style.display = 'none';
        
        if (backToTopBtn) {
            backToTopBtn.style.display = 'none';
        }

        // 対象を表示
        if (screenToShow) {
            screenToShow.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

    // --- イベントリスナー設定 ---

    // 1. 「スワイプイメージ」ボタン
    if (btnSwipeImage) {
        btnSwipeImage.addEventListener('click', () => {
            if (swipeOverlay) {
                swipeOverlay.style.display = 'block';
            }
            document.body.style.overflow = 'hidden';
            
            // ▼▼▼ ここを修正 ▼▼▼
            // (初期化がまだの場合、セレクタを具体的に指定して初期化)
            if (!swiper) { 
                swiper = new Swiper('#swipe-overlay .swiper', { // '.swiper' から変更
                    direction: 'vertical',
                    mousewheel: true,
                    grabCursor: true,
                });
            }
            // ▲▲▲ 修正ここまで ▲▲▲
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

    // 5. スクロール検知 (トップに戻るボタン)
    window.onscroll = () => {
        const isSubScreenVisible = (formScreen && formScreen.style.display === 'block') || 
                                   (notificationScreen && notificationScreen.style.display === 'block');

        if (backToTopBtn && isSubScreenVisible) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        } else if (backToTopBtn) {
            backToTopBtn.style.display = 'none';
        }
    };

    // 6. クリックでスムーズスクロール (トップに戻るボタン)
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});