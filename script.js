document.addEventListener('DOMContentLoaded', () => {
    
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        favorite: document.getElementById('favorite-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        form: document.getElementById('form-screen'), 
        swipe: document.getElementById('swipe-overlay'),
        error: document.getElementById('error-screen'),
        notification: document.getElementById('notification-screen'),
        upload: document.getElementById('image-upload-screen')
    };
    
    const root = document.documentElement;
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupRealOverlay = document.getElementById('popup-real-site-overlay');
    const headerTaskPopup = document.getElementById('header-task-popup');
    
    const btnFab = document.getElementById('fab-main'); 
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop');
    const btnFabPost = document.getElementById('btn-fab-post'); 
    
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnPalette = document.getElementById('btn-palette');
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');

    const btnHeaderNotification = document.getElementById('btn-header-notification');
    const btnHeaderTask = document.getElementById('btn-header-task');
    const btnCloseTaskPopup = document.querySelector('.btn-close-task-popup');

    const pickerMain = document.getElementById('color-main-picker');
    const pickerSub = document.getElementById('color-sub-picker');
    const pickerAccent = document.getElementById('color-accent-picker');
    
    const designToggle = document.getElementById('design-mode-toggle');

    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnErrorImage = document.getElementById('btn-error-image');
    const btnRealSite = document.getElementById('btn-real-site');
    const btnRandom = document.getElementById('btn-random-color');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const btnBackHome = document.querySelector('.btn-back-home');
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');
    
    let swiper = null;

    // --- 画面切り替え ---
    function switchScreen(targetId) {
        if(fabSubmenu) fabSubmenu.classList.remove('active');
        if(btnFab) btnFab.classList.remove('active');
        if(headerTaskPopup) headerTaskPopup.classList.remove('active');

        Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
        
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
            if(screens.form) screens.form.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if(fabSubmenu) fabSubmenu.classList.remove('active');
            if(btnFab) btnFab.classList.remove('active');
        } else {
            if(screens.form) screens.form.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function showPopup(show) { if(popupOverlay) popupOverlay.style.display = show ? 'flex' : 'none'; }
    function showRealPopup(show) { if(popupRealOverlay) popupRealOverlay.style.display = show ? 'flex' : 'none'; }

    function toggleSideMenu(show) {
        const isShow = (typeof show === 'boolean') ? show : !sideMenu.classList.contains('active');
        if (isShow) {
            sideMenuOverlay.style.display = 'block';
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sideMenuOverlay.style.display = 'none';
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // HEXからRGBAへの変換（背景色の透明度調整用）
    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex=hex.slice(1);
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // --- イベントリスナー設定 ---
    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    const notificationPopup = document.getElementById('header-notification-popup');
    const btnCloseNotif = document.querySelector('.btn-close-notification-popup');
    const btnGotoPwa = document.getElementById('btn-goto-pwa-test');

    if (btnHeaderNotification) {
        btnHeaderNotification.addEventListener('click', (e) => {
            e.stopPropagation(); 
            notificationPopup.classList.toggle('active');
            if(headerTaskPopup) headerTaskPopup.classList.remove('active');
        });
    }

    if(btnCloseNotif) btnCloseNotif.addEventListener('click', () => notificationPopup.classList.remove('active'));
    if(btnGotoPwa) btnGotoPwa.addEventListener('click', () => { notificationPopup.classList.remove('active'); switchScreen('notification-screen'); });
    if (btnHeaderTask) btnHeaderTask.addEventListener('click', () => headerTaskPopup.classList.toggle('active'));
    if (btnCloseTaskPopup) btnCloseTaskPopup.addEventListener('click', () => headerTaskPopup.classList.remove('active'));
    
    if (btnPalette) btnPalette.addEventListener('click', () => toggleSideMenu());
    if (btnFab) btnFab.addEventListener('click', () => { btnFab.classList.toggle('active'); fabSubmenu.classList.toggle('active'); });
    if (btnFindShop) btnFindShop.addEventListener('click', () => switchScreen('search-screen'));
    if (btnFabPost) btnFabPost.addEventListener('click', () => toggleFormModal(true));

    if(btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));
    if(btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    if(btnErrorImage) btnErrorImage.addEventListener('click', () => switchScreen('error-screen'));
    if(btnRealSite) btnRealSite.addEventListener('click', () => showRealPopup(true));

    if(btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if(formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));
    
    const btnClosePopup = document.getElementById('btn-close-popup');
    if(btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if(popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target===popupOverlay) showPopup(false); });
    const btnCloseRealPopup = document.getElementById('btn-close-real-popup');
    if(btnCloseRealPopup) btnCloseRealPopup.addEventListener('click', () => showRealPopup(false));
    if(popupRealOverlay) popupRealOverlay.addEventListener('click', (e) => { if(e.target===popupRealOverlay) showRealPopup(false); });

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
    document.querySelectorAll('.card-content').forEach(card => {
        card.addEventListener('click', (e) => {
            if(!e.target.closest('.side-action-btn')) {
                screens.swipe.style.display = 'none';
                document.body.style.overflow = 'auto';
                switchScreen('mypage-screen');
            }
        });
    });

    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') btn.addEventListener('click', () => switchScreen('main-menu'));
    });
    if(btnBackHome) btnBackHome.addEventListener('click', () => switchScreen('main-menu'));
    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    // --- カラーパレット・デザイン設定 ---
    
    // スタイル (立体/のっぺり)
    if(designToggle) {
        if(document.body.classList.contains('flat-mode')) designToggle.checked = true;
        designToggle.addEventListener('change', (e) => {
            if(e.target.checked) document.body.classList.add('flat-mode');
            else document.body.classList.remove('flat-mode');
        });
    }

    // カラーピッカー (優先度: importantを付与してテーマCSSを上書き)
    const updateColor = (varName, value) => {
        // body要素に直接 !important 付きでスタイルを設定し、テーマのクラスCSSよりも優先させる
        document.body.style.setProperty(varName, value, 'important');
        
        // アクセントカラーの場合は関連色も更新
        if (varName === '--color-accent') {
            document.body.style.setProperty('--color-text-current', value, 'important');
            document.body.style.setProperty('--color-btn-bg', hexToLightRgba(value, 0.05), 'important');
        }
    };

    if(pickerMain) pickerMain.addEventListener('input', (e) => updateColor('--color-main', e.target.value));
    if(pickerSub) pickerSub.addEventListener('input', (e) => updateColor('--color-sub', e.target.value));
    if(pickerAccent) pickerAccent.addEventListener('input', (e) => updateColor('--color-accent', e.target.value));

    // ランダムカラー
    if(btnRandom) {
        btnRandom.addEventListener('click', () => {
            const getRandomHex = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
                return color;
            };
            const m = getRandomHex(); const s = getRandomHex(); const a = getRandomHex();
            if(pickerMain) { pickerMain.value = m; updateColor('--color-main', m); }
            if(pickerSub) { pickerSub.value = s; updateColor('--color-sub', s); }
            if(pickerAccent) { pickerAccent.value = a; updateColor('--color-accent', a); }
        });
    }

    // 明るさ調整
    const adjustBrightness = (val) => {
        let currentFilter = document.getElementById('bg-layer').style.filter || 'brightness(100%)';
        let match = currentFilter.match(/brightness\((\d+)%\)/);
        let currentVal = match ? parseInt(match[1]) : 100;
        document.getElementById('bg-layer').style.filter = `brightness(${currentVal + val}%)`;
    };
    document.getElementById('btn-lighten').addEventListener('click', () => adjustBrightness(10));
    document.getElementById('btn-darken').addEventListener('click', () => adjustBrightness(-10));
    document.getElementById('btn-reset-brightness').addEventListener('click', () => { document.getElementById('bg-layer').style.filter = 'brightness(100%)'; });

    window.onscroll = () => {
        if (backToTopBtn) backToTopBtn.style.display = (window.scrollY > 100) ? 'block' : 'none';
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // --- 画像切り抜きロジック ---
    const imageUploadScreen = document.getElementById('image-upload-screen');
    const uploadGuideText = document.getElementById('upload-guide-text');
    const galleryInput = document.getElementById('gallery-image-input');
    const galleryCropperWrapper = document.getElementById('gallery-cropper-wrapper');
    const galleryImageToCrop = document.getElementById('gallery-image-to-crop');
    const btnConfirmCrop = document.getElementById('btn-confirm-crop');
    let galleryCropper = null;

    window.openImageUpload = function(guideName) {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
            if(uploadGuideText) uploadGuideText.textContent = `ガイド: ${guideName}の写真`;
            if(galleryInput) galleryInput.value = '';
            if(galleryCropperWrapper) galleryCropperWrapper.style.display = 'none';
            if(btnConfirmCrop) btnConfirmCrop.style.display = 'none';
            if(galleryCropper) { galleryCropper.destroy(); galleryCropper = null; }
        }
    };
    window.closeImageUpload = function() {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    if(galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                if (galleryCropper) galleryCropper.destroy();
                galleryImageToCrop.src = event.target.result;
                galleryCropperWrapper.style.display = 'block';
                btnConfirmCrop.style.display = 'block';
                galleryCropper = new Cropper(galleryImageToCrop, {
                    aspectRatio: 1, viewMode: 1, dragMode: 'move', autoCropArea: 1.0, guides: true, center: true, highlight: false, background: false,
                });
            };
            reader.readAsDataURL(file);
        });
    }
    if(btnConfirmCrop) {
        btnConfirmCrop.addEventListener('click', () => {
            if(!galleryCropper) return;
            alert("切り取り完了！\n(このデモではここまでです)");
            closeImageUpload();
        });
    }
});

// --- グローバル関数定義 ---
window.toggleUserType = function(btn) {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
};

window.setTheme = function(themeName) {
    const body = document.body;
    body.classList.remove('theme-hotel', 'theme-chic', 'theme-modern');
    
    document.querySelectorAll('.btn-theme-switch').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-theme') === themeName) btn.classList.add('active');
    });

    if (themeName !== 'default') {
        body.classList.add('theme-' + themeName);
    }
    
    // テーマ切り替え時、明度フィルターをリセットして見やすくする
    const bgLayer = document.getElementById('bg-layer');
    if(bgLayer) bgLayer.style.filter = 'brightness(100%)';
};
