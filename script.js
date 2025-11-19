document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面定義 ---
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        profile: document.getElementById('profile-screen'),
        form: document.getElementById('form-screen'), 
        swipe: document.getElementById('swipe-overlay')
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    
    // FAB
    const btnFab = document.getElementById('fab-main'); 
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop');
    
    // サイドメニュー
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); 
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');
    const root = document.documentElement;
    const bgLayer = document.getElementById('bg-layer');

    // メニューボタン
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnProfileImage = document.getElementById('btn-profile-image');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');

    let swiper = null;

    // --- 画面切り替え ---
    function switchScreen(targetId) {
        // FABメニュー閉じる
        if(fabSubmenu) fabSubmenu.classList.remove('active');

        // ★重要: 全画面を非表示にする (スワイプやフォームも含める)
        Object.values(screens).forEach(el => {
            if(el) el.style.display = 'none';
        });
        
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        // タスクバー
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) item.classList.add('active');
            else item.classList.remove('active');
        });
        
        if (backToTopBtn) backToTopBtn.style.display = 'none';
    }

    // フォーム (モーダル)
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

    function showPopup(show) {
        popupOverlay.style.display = show ? 'flex' : 'none';
    }
    function toggleSideMenu(show) {
        if (show) {
            sideMenuOverlay.classList.add('active');
            sideMenu.classList.add('active');
        } else {
            sideMenuOverlay.classList.remove('active');
            sideMenu.classList.remove('active');
        }
    }

    // 色変換ヘルパー
    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex=hex.slice(1);
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // --- イベント ---

    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    if (btnFab) btnFab.addEventListener('click', () => fabSubmenu.classList.toggle('active'));
    if (btnFindShop) btnFindShop.addEventListener('click', () => switchScreen('search-screen'));

    if (btnFormImage) btnFormImage.addEventListener('click', () => toggleFormModal(true));
    if (btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if (formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));

    // スワイプ
    if (btnSwipeImage) btnSwipeImage.addEventListener('click', () => {
        if (screens.swipe) screens.swipe.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const container = document.querySelector('#swipe-overlay .swiper');
            if (!swiper && container) { 
                swiper = new Swiper(container, { direction: 'vertical', mousewheel: true, grabCursor: true });
            }
        }, 100);
    });
    if (closeSwipeBtn) closeSwipeBtn.addEventListener('click', () => {
        screens.swipe.style.display = 'none';
        document.body.style.overflow = 'auto';
        switchScreen('main-menu');
    });

    if (btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    document.getElementById('btn-close-popup').addEventListener('click', () => showPopup(false));
    document.getElementById('btn-popup-cancel').addEventListener('click', () => showPopup(false));
    document.getElementById('btn-popup-ok').addEventListener('click', () => showPopup(false));

    if (btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));
    if (btnProfileImage) btnProfileImage.addEventListener('click', () => switchScreen('profile-screen'));

    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') {
            btn.addEventListener('click', () => switchScreen('main-menu'));
        }
    });

    if (btnHamburger) btnHamburger.addEventListener('click', () => toggleSideMenu(true));
    if (btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    // --- Design Control ---
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.target.getAttribute('data-theme');
            let start, end;
            switch(theme) {
                case 'lemon': start='#f6fd86'; end='#afdece'; break; 
                case 'lime': start='#c6ff00'; end='#f0f8ff'; break;
                case 'mint': start='#98fb98'; end='#e0ffff'; break;
                case 'navy': start='#000080'; end='#191970'; break; 
                case 'lavender': start='#e6e6fa'; end='#fff0f5'; break;
                case 'salmon': start='#fa8072'; end='#ffe4e1'; break;
                case 'beige': start='#f5f5dc'; end='#faf0e6'; break;
            }
            root.style.setProperty('--color-bg-start', start);
            root.style.setProperty('--color-bg-end', end);
            // ネイビーの時は文字白
            if(theme==='navy'){ root.style.setProperty('--color-text', '#fff'); root.style.setProperty('--color-text-current', '#fff'); }
            else { root.style.setProperty('--color-text', '#333'); } 
            // アクセントカラーの設定が優先されるので text-current はアクセント選択時に上書きされる
        });
    });

    document.querySelectorAll('.accent-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const accent = e.target.getAttribute('data-accent');
            let p, d;
            switch(accent) {
                case 'space-navy': p='#191970'; d='#000080'; break;
                case 'deep-green': p='#006400'; d='#004d00'; break;
                case 'blood-red': p='#8b0000'; d='#500000'; break;
                case 'grandpa-brown': p='#8b4513'; d='#5e2f0d'; break;
                case 'jet-black': p='#000000'; d='#333333'; break;
            }
            root.style.setProperty('--color-primary', p);
            root.style.setProperty('--color-primary-dark', d);
            root.style.setProperty('--color-accent', p);
            root.style.setProperty('--color-text-current', p); // 全体の文字色変更
            
            // ボタン背景を薄く
            root.style.setProperty('--color-btn-bg', hexToLightRgba(p, 0.05));
        });
    });

    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const s = e.target.getAttribute('data-style');
            document.body.classList.remove('flat-design', 'super-3d');
            if(s==='flat') document.body.classList.add('flat-design');
            else if(s==='super-3d') document.body.classList.add('super-3d');
        });
    });

    const adjustBrightness = (val) => {
        let currentFilter = bgLayer.style.filter || 'brightness(100%)';
        let match = currentFilter.match(/brightness\((\d+)%\)/);
        let currentVal = match ? parseInt(match[1]) : 100;
        bgLayer.style.filter = `brightness(${currentVal + val}%)`;
    };
    document.getElementById('btn-lighten').addEventListener('click', () => adjustBrightness(10));
    document.getElementById('btn-darken').addEventListener('click', () => adjustBrightness(-10));
    document.getElementById('btn-reset-brightness').addEventListener('click', () => { bgLayer.style.filter = 'brightness(100%)'; });
    
    // Cropper
    if(document.getElementById('image-upload-input')) {
        // (Cropper logic omitted for brevity, same as before)
    }
});
