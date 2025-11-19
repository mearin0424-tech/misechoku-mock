document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素 ---
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        form: document.getElementById('form-screen'), 
        swipe: document.getElementById('swipe-overlay'),
        profile: document.getElementById('profile-screen')
    };
    
    const root = document.documentElement;

    // --- ナビゲーション & ボタン ---
    const navItems = document.querySelectorAll('.nav-item');
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    
    // メインメニュー
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');

    // FAB
    const btnFab = document.getElementById('fab-main');
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop'); // お店を探す

    // サイドメニュー
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); 
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');

    // デザインコントロール (カラーピッカー)
    const pickerMain = document.getElementById('color-main-picker');
    const pickerSub = document.getElementById('color-sub-picker');
    const pickerAccent = document.getElementById('color-accent-picker');
    const designRadios = document.getElementsByName('design-style');

    // その他
    let swiper = null;
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');
    const popupOverlay = document.getElementById('popup-overlay');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    const btnClosePopup = document.getElementById('btn-close-popup');


    // --- 関数定義 ---

    function switchScreen(targetId) {
        // FAB閉じる
        if(fabSubmenu) fabSubmenu.classList.remove('active');

        // 全画面非表示
        Object.values(screens).forEach(el => {
            if(el) el.style.display = 'none';
        });
        
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        // タスクバー更新
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function toggleSideMenu(show) {
        if (show) {
            sideMenuOverlay.style.display = 'block';
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sideMenuOverlay.style.display = 'none';
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function toggleFormModal(show) {
        if (show) {
            screens.form.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if(fabSubmenu) fabSubmenu.classList.remove('active');
        } else {
            screens.form.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // --- イベントリスナー ---

    // 1. タスクバー切り替え
    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    // 2. FAB操作
    if(btnFab) {
        btnFab.addEventListener('click', () => {
            fabSubmenu.classList.toggle('active');
        });
    }
    // お店を探す -> 検索画面
    if(btnFindShop) {
        btnFindShop.addEventListener('click', () => switchScreen('search-screen'));
    }

    // 3. メインメニューボタン
    if(btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));
    if(btnFormImage) btnFormImage.addEventListener('click', () => toggleFormModal(true));
    if(btnPopupImage) btnPopupImage.addEventListener('click', () => { popupOverlay.style.display = 'flex'; });

    // スワイプ画面
    if(btnSwipeImage) {
        btnSwipeImage.addEventListener('click', () => {
            screens.swipe.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const container = document.querySelector('#swipe-overlay .swiper');
                if (!swiper && container) { 
                    swiper = new Swiper(container, { direction: 'vertical', mousewheel: true, grabCursor: true });
                }
            }, 100);
        });
    }
    if(closeSwipeBtn) {
        closeSwipeBtn.addEventListener('click', () => {
            screens.swipe.style.display = 'none';
            document.body.style.overflow = 'auto';
            switchScreen('main-menu');
        });
    }

    // 4. デザインコントロール (リアルタイム反映)
    
    // カラー変更
    const updateColor = (varName, value) => root.style.setProperty(varName, value);
    
    if(pickerMain) pickerMain.addEventListener('input', (e) => updateColor('--color-main', e.target.value));
    if(pickerSub) pickerSub.addEventListener('input', (e) => updateColor('--color-sub', e.target.value));
    if(pickerAccent) pickerAccent.addEventListener('input', (e) => updateColor('--color-accent', e.target.value));

    // デザインモード変更
    Array.from(designRadios).forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'flat') {
                document.body.classList.add('flat-mode');
            } else {
                document.body.classList.remove('flat-mode');
            }
        });
    });

    // ハンバーガー
    if(btnHamburger) btnHamburger.addEventListener('click', () => toggleSideMenu(true));
    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    // 5. 共通戻るボタン
    backButtons.forEach(btn => {
        if(btn.id !== 'btn-swipe-close') {
            btn.addEventListener('click', () => switchScreen('main-menu'));
        }
    });

    // 6. モーダル・ポップアップ閉じる系
    if(btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if(formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));
    
    if(btnClosePopup) btnClosePopup.addEventListener('click', () => popupOverlay.style.display = 'none');
    if(btnPopupCancel) btnPopupCancel.addEventListener('click', () => popupOverlay.style.display = 'none');
    if(btnPopupOk) btnPopupOk.addEventListener('click', () => popupOverlay.style.display = 'none');
    if(popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target===popupOverlay) popupOverlay.style.display = 'none'; });

});
