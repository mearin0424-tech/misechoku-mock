document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素 ---
    const mainMenu = document.getElementById('main-menu');
    const formScreen = document.getElementById('form-screen');
    const notificationScreen = document.getElementById('notification-screen');
    const swipeOverlay = document.getElementById('swipe-overlay');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    const swiperContainer = document.querySelector('#swipe-overlay .swiper');
    const profileScreen = document.getElementById('profile-screen');

    // --- サイドメニュー要素 ---
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); // ID変更
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');
    const root = document.documentElement; 
    
    // 背景レイヤー
    const bgLayer = document.getElementById('bg-layer');

    // --- メインメニューのボタン ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnProfileImage = document.getElementById('btn-profile-image');

    // --- 戻るボタン群 ---
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));

    // --- スワイプ関連 ---
    let swiper = null; 
    const closeSwipeBtn = document.getElementById('btn-swipe-close');

    // --- ポップアップ関連 ---
    const btnClosePopup = document.getElementById('btn-close-popup');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    
    // --- Cropper関連 ---
    const imageUploadInput = document.getElementById('image-upload-input');
    const cropperWrapper = document.getElementById('cropper-wrapper');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnCropImage = document.getElementById('btn-crop-image');
    const cropResultContainer = document.getElementById('crop-result-container');
    const cropResultImage = document.getElementById('crop-result-image');
    let cropper = null; 

    // --- 画面切り替え関数 ---
    function showScreen(screenToShow) {
        if (mainMenu) mainMenu.style.display = 'none';
        if (formScreen) formScreen.style.display = 'none';
        if (notificationScreen) notificationScreen.style.display = 'none';
        if (profileScreen) profileScreen.style.display = 'none';
        if (backToTopBtn) backToTopBtn.style.display = 'none';

        if (screenToShow) {
            screenToShow.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }
    
    function showPopup(show) {
        if (popupOverlay) {
            popupOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    function toggleSideMenu(show) {
        if (show) {
            sideMenuOverlay.classList.add('active');
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sideMenuOverlay.classList.remove('active');
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // ヘルパー関数: Hex色コードを薄くする (RGBA変換)
    function hexToLightRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }


    // --- イベントリスナー ---

    // ハンバーガーメニュー
    if (btnHamburger) {
        btnHamburger.addEventListener('click', () => toggleSideMenu(true));
    }
    if (btnCloseSideMenu) {
        btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    }
    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));
    }

    // カラーテーマ
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.target.getAttribute('data-theme');
            let startColor, endColor;
            
            switch(theme) {
                case 'lemon': startColor = '#f6fd86'; endColor = '#afdece'; break; 
                case 'lime': startColor = '#c6ff00'; endColor = '#f0f8ff'; break;
                case 'mint': startColor = '#98fb98'; endColor = '#e0ffff'; break;
                case 'navy': startColor = '#000080'; endColor = '#191970'; break; 
                case 'lavender': startColor = '#e6e6fa'; endColor = '#fff0f5'; break;
                case 'salmon': startColor = '#fa8072'; endColor = '#ffe4e1'; break;
                case 'beige': startColor = '#f5f5dc'; endColor = '#faf0e6'; break;
                default: return;
            }
            
            root.style.setProperty('--color-bg-start', startColor);
            root.style.setProperty('--color-bg-end', endColor);
            
            if (theme === 'navy') {
                root.style.setProperty('--color-text', '#ffffff');
                root.style.setProperty('--color-text-brown', '#ffebcd');
            } else {
                root.style.setProperty('--color-text', '#333');
                root.style.setProperty('--color-text-brown', '#8B4513');
            }
        });
    });

    // アクセントカラー (ボタン背景も変更)
    document.querySelectorAll('.accent-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const accent = e.target.getAttribute('data-accent');
            let primary, dark;

            switch(accent) {
                case 'space-navy': primary = '#191970'; dark = '#000080'; break;
                case 'deep-green': primary = '#006400'; dark = '#004d00'; break;
                case 'blood-red': primary = '#8b0000'; dark = '#500000'; break;
                case 'grandpa-brown': primary = '#8b4513'; dark = '#5e2f0d'; break;
                case 'jet-black': primary = '#000000'; dark = '#333333'; break;
                default: return;
            }

            root.style.setProperty('--color-primary', primary);
            root.style.setProperty('--color-primary-dark', dark);
            root.style.setProperty('--color-text-brown', primary);
            
            // ▼▼▼ ボタンの背景色を薄い色に変更 ▼▼▼
            // 透過度 0.05 (5%) の薄い色を生成
            const lightBg = hexToLightRgba(primary, 0.05);
            root.style.setProperty('--color-btn-bg', lightBg);
            // ▲▲▲ 追加 ▲▲▲
        });
    });

    // デザイン
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const style = e.target.getAttribute('data-style');
            document.body.classList.remove('flat-design', 'super-3d');
            if (style === 'flat') document.body.classList.add('flat-design');
            else if (style === 'super-3d') document.body.classList.add('super-3d');
        });
    });

    // 濃淡調整 (背景レイヤーのみに適用)
    const adjustBrightness = (amount) => {
        // #bg-layer から現在のフィルタ値を取得
        let currentFilter = bgLayer.style.filter || 'brightness(100%)';
        // 正規表現で数値部分だけ取り出す
        let match = currentFilter.match(/brightness\((\d+)%\)/);
        let currentVal = match ? parseInt(match[1]) : 100;
        
        let newVal = currentVal + amount;
        if (newVal < 50) newVal = 50;
        if (newVal > 150) newVal = 150;
        
        bgLayer.style.filter = `brightness(${newVal}%)`;
    };
    document.getElementById('btn-lighten').addEventListener('click', () => adjustBrightness(10));
    document.getElementById('btn-darken').addEventListener('click', () => adjustBrightness(-10));


    // --- 既存イベントリスナー ---
    if (btnSwipeImage) btnSwipeImage.addEventListener('click', () => {
        if (swipeOverlay) swipeOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (!swiper && swiperContainer) { 
            swiper = new Swiper(swiperContainer, { direction: 'vertical', mousewheel: true, grabCursor: true });
        }
    });
    if (closeSwipeBtn) closeSwipeBtn.addEventListener('click', () => {
        if (swipeOverlay) swipeOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        showScreen(mainMenu); 
    });

    if (btnFormImage) btnFormImage.addEventListener('click', () => showScreen(formScreen));
    if (btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => showScreen(notificationScreen));
    if (btnProfileImage) btnProfileImage.addEventListener('click', () => showScreen(profileScreen));

    backButtons.forEach(button => {
        if (button.id !== 'btn-swipe-close') { 
            button.addEventListener('click', () => showScreen(mainMenu));
        }
    });

    window.onscroll = () => {
        const isSubScreenVisible = (formScreen && formScreen.style.display === 'block') || 
                                   (notificationScreen && notificationScreen.style.display === 'block') ||
                                   (profileScreen && profileScreen.style.display === 'block');
        if (backToTopBtn && isSubScreenVisible) {
            backToTopBtn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? 'block' : 'none';
        } else if (backToTopBtn) {
            backToTopBtn.style.display = 'none';
        }
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

    if (btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    if (btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if (btnPopupCancel) btnPopupCancel.addEventListener('click', () => showPopup(false));
    if (btnPopupOk) btnPopupOk.addEventListener('click', () => showPopup(false));
    if (popupOverlay) popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) showPopup(false); });
    
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                if (cropper) cropper.destroy();
                imageToCrop.src = event.target.result;
                cropperWrapper.style.display = 'block';
                cropper = new Cropper(imageToCrop, { aspectRatio: 1 / 1, viewMode: 1, autoCropArea: 0.8, minCropBoxWidth: 320, minCropBoxHeight: 320, ready() { cropper.setCropBoxData({ width: 320, height: 320 }); } });
                cropResultContainer.style.display = 'none'; 
            };
            reader.readAsDataURL(file);
        });
    }
    if (btnCropImage) btnCropImage.addEventListener('click', () => {
        if (!cropper) return;
        const croppedCanvas = cropper.getCroppedCanvas({ width: 320, height: 320, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
        if (!croppedCanvas) return;
        cropResultImage.src = croppedCanvas.toDataURL('image/png');
        cropResultContainer.style.display = 'block';
    });
    
    const infoIcons = document.querySelectorAll('.info-icon');
    let activeTooltip = null; 
    infoIcons.forEach(icon => {
        const hintText = icon.getAttribute('data-tooltip') || "ヒント";
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = hintText;
        icon.appendChild(tooltip); 
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (icon.classList.contains('focused')) { icon.classList.remove('focused'); activeTooltip = null; } 
            else { if (activeTooltip) activeTooltip.classList.remove('focused'); icon.classList.add('focused'); activeTooltip = icon; }
        });
    });
    document.addEventListener('click', (e) => { if (activeTooltip) { activeTooltip.classList.remove('focused'); activeTooltip = null; } });
});
