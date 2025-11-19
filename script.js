document.addEventListener('DOMContentLoaded', () => {
    
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        form: document.getElementById('form-screen'), 
        swipe: document.getElementById('swipe-overlay'),
        error: document.getElementById('error-screen'),
        favorite: document.getElementById('favorite-screen')
    };
    
    const root = document.documentElement;

    // --- ナビゲーション ---
    const navItems = document.querySelectorAll('.nav-item');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    
    // ポップアップ
    const popupOverlay = document.getElementById('popup-overlay');
    const popupRealOverlay = document.getElementById('popup-real-site-overlay');
    const headerTaskPopup = document.getElementById('header-task-popup');
    
    // FAB
    const btnFab = document.getElementById('fab-main'); 
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop');
    const btnFindGirl = document.getElementById('btn-find-girl');
    const btnFabPost = document.getElementById('btn-fab-post'); 
    
    // サイドメニュー
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); 
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');

    // ヘッダー
    const btnHeaderNotification = document.getElementById('btn-header-notification');
    const btnHeaderTask = document.getElementById('btn-header-task');
    const btnCloseTaskPopup = document.querySelector('.btn-close-task-popup');

    // デザインコントロール
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
    const btnRealSite = document.getElementById('btn-real-site');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const btnBackHome = document.querySelector('.btn-back-home');
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');

    let swiper = null;

    // --- 関数 ---
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
            screens.form.style.display = 'block';
            document.body.style.overflow = 'hidden';
            if(fabSubmenu) fabSubmenu.classList.remove('active');
            if(btnFab) btnFab.classList.remove('active');
        } else {
            screens.form.style.display = 'none';
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

    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex=hex.slice(1);
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // --- イベント登録 ---

    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    // ヘッダー
    if (btnHeaderNotification) btnHeaderNotification.addEventListener('click', () => switchScreen('notification-screen'));
    if (btnHeaderTask) btnHeaderTask.addEventListener('click', () => headerTaskPopup.classList.toggle('active'));
    if (btnCloseTaskPopup) btnCloseTaskPopup.addEventListener('click', () => headerTaskPopup.classList.remove('active'));
    if (btnHamburger) btnHamburger.addEventListener('click', () => toggleSideMenu());

    // FAB
    if (btnFab) btnFab.addEventListener('click', () => { btnFab.classList.toggle('active'); fabSubmenu.classList.toggle('active'); });
    if (btnFindShop) btnFindShop.addEventListener('click', () => switchScreen('search-screen'));
    if (btnFindGirl) btnFindGirl.addEventListener('click', () => switchScreen('search-screen'));
    if (btnFabPost) btnFabPost.addEventListener('click', () => toggleFormModal(true));

    // メニューボタン
    if(btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));
    if(btnFormImage) btnFormImage.addEventListener('click', () => toggleFormModal(true));
    if(btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    if(btnErrorImage) btnErrorImage.addEventListener('click', () => switchScreen('error-screen'));
    if(btnRealSite) btnRealSite.addEventListener('click', () => showRealPopup(true));

    // 閉じる系
    if(btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if(formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));
    
    const btnClosePopup = document.getElementById('btn-close-popup');
    if(btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if(popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target===popupOverlay) showPopup(false); });
    
    const btnCloseRealPopup = document.getElementById('btn-close-real-popup');
    if(btnCloseRealPopup) btnCloseRealPopup.addEventListener('click', () => showRealPopup(false));
    if(popupRealOverlay) popupRealOverlay.addEventListener('click', (e) => { if(e.target===popupRealOverlay) showRealPopup(false); });

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
    if(closeSwipeBtn) closeSwipeBtn.addEventListener('click', () => {
        screens.swipe.style.display = 'none';
        document.body.style.overflow = 'auto';
        switchScreen('main-menu');
    });
    // 画像クリックでプロフィールへ
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

    // Design Control
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
            if(e.target.value === 'flat') document.body.classList.add('flat-mode');
            else document.body.classList.remove('flat-mode');
        });
    });

    // 濃淡調整
    const adjustBrightness = (val) => {
        let currentFilter = document.getElementById('bg-layer').style.filter || 'brightness(100%)';
        let match = currentFilter.match(/brightness\((\d+)%\)/);
        let currentVal = match ? parseInt(match[1]) : 100;
        document.getElementById('bg-layer').style.filter = `brightness(${currentVal + val}%)`;
    };
    document.getElementById('btn-lighten').addEventListener('click', () => adjustBrightness(10));
    document.getElementById('btn-darken').addEventListener('click', () => adjustBrightness(-10));
    document.getElementById('btn-reset-brightness').addEventListener('click', () => { document.getElementById('bg-layer').style.filter = 'brightness(100%)'; });

    // Scroll top
    window.onscroll = () => {
        if (backToTopBtn) backToTopBtn.style.display = (window.scrollY > 100) ? 'block' : 'none';
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    
    // Cropper & File Input
    const imageUploadInput = document.getElementById('image-upload-input');
    if(imageUploadInput) {
        const fileNameDisplay = document.getElementById('file-name-display');
        const cropperWrapper = document.getElementById('cropper-wrapper');
        const imageToCrop = document.getElementById('image-to-crop');
        const btnCropImage = document.getElementById('btn-crop-image');
        const cropResultContainer = document.getElementById('crop-result-container');
        const cropResultImage = document.getElementById('crop-result-image');
        let cropper = null;

        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if(fileNameDisplay) fileNameDisplay.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (cropper) cropper.destroy();
                imageToCrop.src = event.target.result;
                cropperWrapper.style.display = 'block';
                cropper = new Cropper(imageToCrop, { aspectRatio: 1, viewMode: 1, autoCropArea: 0.8, minCropBoxWidth: 320, minCropBoxHeight: 320, ready() { cropper.setCropBoxData({ width: 320, height: 320 }); } });
                cropResultContainer.style.display = 'none'; 
            };
            reader.readAsDataURL(file);
        });
        if(btnCropImage) {
            btnCropImage.addEventListener('click', () => {
                if (!cropper) return;
                const canvas = cropper.getCroppedCanvas({ width: 320, height: 320, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
                if (canvas) {
                    cropResultImage.src = canvas.toDataURL('image/png');
                    cropResultContainer.style.display = 'block';
                }
            });
        }
    }
    
    document.querySelectorAll('.info-icon').forEach(icon => {
        const text = icon.getAttribute('data-tooltip') || "ヒント";
        const tip = document.createElement('span');
        tip.className = 'tooltip-text';
        tip.textContent = text;
        icon.appendChild(tip);
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.classList.toggle('focused');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.info-icon.focused').forEach(el => el.classList.remove('focused'));
    });
});
