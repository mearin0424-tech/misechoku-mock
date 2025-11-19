document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素 ---
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        // profile は削除
        form: document.getElementById('form-screen'), 
        swipe: document.getElementById('swipe-overlay'),
        error: document.getElementById('error-screen')
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    
    // FAB
    const btnFab = document.getElementById('fab-main'); 
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop');
    const btnFabPost = document.getElementById('btn-fab-post'); 
    
    // サイドメニュー
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); 
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');
    const root = document.documentElement;

    // ヘッダー通知ボタン
    const btnHeaderNotification = document.getElementById('btn-header-notification');

    // デザインコントロール (カラーピッカー)
    const pickerMain = document.getElementById('color-main-picker');
    const pickerSub = document.getElementById('color-sub-picker');
    const pickerAccent = document.getElementById('color-accent-picker');
    const designRadios = document.getElementsByName('design-style');

    // メニューボタン
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnErrorImage = document.getElementById('btn-error-image');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const btnBackHome = document.querySelector('.btn-back-home');

    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');

    let swiper = null;

    // --- 関数定義 ---

    function switchScreen(targetId) {
        if(fabSubmenu) fabSubmenu.classList.remove('active');
        if(btnFab) btnFab.classList.remove('active');

        Object.values(screens).forEach(el => {
            if(el) el.style.display = 'none';
        });
        
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) item.classList.add('active');
            else item.classList.remove('active');
        });
        
        if (backToTopBtn) backToTopBtn.style.display = 'none';
    }

    function toggleFormModal(show) {
        if (show) {
            screens.form.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if(fabSubmenu) fabSubmenu.classList.remove('active');
            if(btnFab) btnFab.classList.remove('active');
        } else {
            screens.form.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function showPopup(show) {
        popupOverlay.style.display = show ? 'flex' : 'none';
    }

    function toggleSideMenu() {
        const isActive = sideMenu.classList.contains('active');
        if (isActive) {
            sideMenuOverlay.style.display = 'none';
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            sideMenuOverlay.style.display = 'block';
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex=hex.slice(1);
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return `rgba(${r},${g},${b},${alpha})`;
    }


    // --- イベントリスナー ---

    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    // ヘッダー
    if (btnHeaderNotification) {
        btnHeaderNotification.addEventListener('click', () => switchScreen('notification-screen'));
    }
    if (btnHamburger) {
        btnHamburger.addEventListener('click', () => toggleSideMenu());
    }

    // FAB
    if(btnFab) {
        btnFab.addEventListener('click', () => {
            btnFab.classList.toggle('active');
            fabSubmenu.classList.toggle('active');
        });
    }
    if(btnFindShop) btnFindShop.addEventListener('click', () => switchScreen('search-screen'));
    if(btnFabPost) btnFabPost.addEventListener('click', () => toggleFormModal(true));

    // メインメニュー
    if(btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));
    if(btnFormImage) btnFormImage.addEventListener('click', () => toggleFormModal(true));
    if(btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    if(btnErrorImage) btnErrorImage.addEventListener('click', () => switchScreen('error-screen'));

    if(btnBackHome) btnBackHome.addEventListener('click', () => switchScreen('main-menu'));

    // フォーム閉じる
    if(btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if(formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));

    // スワイプ画面
    if(btnSwipeImage) {
        btnSwipeImage.addEventListener('click', () => {
            if(screens.swipe) screens.swipe.style.display = 'block';
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

    // ポップアップ
    document.getElementById('btn-close-popup').addEventListener('click', () => showPopup(false));
    document.getElementById('btn-popup-cancel').addEventListener('click', () => showPopup(false));
    document.getElementById('btn-popup-ok').addEventListener('click', () => showPopup(false));
    if (popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target===popupOverlay) showPopup(false); });

    // 戻るボタン
    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') {
            btn.addEventListener('click', () => switchScreen('main-menu'));
        }
    });

    // サイドメニュー
    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu());
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu());


    // --- Design Control (カラーピッカー) ---
    
    const updateColor = (varName, value) => {
        root.style.setProperty(varName, value);
        if (varName === '--color-accent') {
            root.style.setProperty('--color-text-current', value);
            root.style.setProperty('--color-btn-bg', hexToLightRgba(value, 0.05));
        }
    };
    
    if(pickerMain) pickerMain.addEventListener('input', (e) => updateColor('--color-main', e.target.value));
    if(pickerSub) pickerSub.addEventListener('input', (e) => updateColor('--color-sub', e.target.value));
    if(pickerAccent) pickerAccent.addEventListener('input', (e) => {
        const val = e.target.value;
        updateColor('--color-accent', val);
        updateColor('--color-text-current', val);
        root.style.setProperty('--color-btn-bg', hexToLightRgba(val, 0.05));
    });

    Array.from(designRadios).forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'flat') {
                document.body.classList.add('flat-mode');
            } else {
                document.body.classList.remove('flat-mode');
            }
        });
    });

    // Scroll top
    window.onscroll = () => {
        if (backToTopBtn) backToTopBtn.style.display = (window.scrollY > 100) ? 'block' : 'none';
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    
    // Cropper
    if(imageUploadInput) {
        // ... (Cropper logic is same as before) ...
    }
    
    // Tooltip
    document.querySelectorAll('.info-icon').forEach(icon => {
        // ... (Tooltip logic is same as before) ...
    });
});