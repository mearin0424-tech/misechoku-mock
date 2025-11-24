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
        notification: document.getElementById('notification-screen')
    };
    
    const root = document.documentElement;
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
    const designRadios = document.getElementsByName('design-style');

    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnErrorImage = document.getElementById('btn-error-image');
    const btnRealSite = document.getElementById('btn-real-site');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const btnBackHome = document.querySelector('.btn-back-home');
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');
    const designToggle = document.getElementById('design-mode-toggle');
    const btnRandom = document.getElementById('btn-random-color');
    
    if(btnRandom) {
        btnRandom.addEventListener('click', () => {
            // ランダムなHEX色を生成する関数
            const getRandomHex = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };

            // 3色生成
            const mainColor = getRandomHex();
            const subColor = getRandomHex();
            const accentColor = getRandomHex();

            // ピッカーの値を変えて、inputイベントを発火（既存の更新処理を動かす）
            if(pickerMain) {
                pickerMain.value = mainColor;
                pickerMain.dispatchEvent(new Event('input'));
            }
            if(pickerSub) {
                pickerSub.value = subColor;
                pickerSub.dispatchEvent(new Event('input'));
            }
            if(pickerAccent) {
                pickerAccent.value = accentColor;
                pickerAccent.dispatchEvent(new Event('input'));
            }
        });
    }
    
    if(designToggle) {
        // 初期状態チェック (HTML側でchecked属性があれば適用)
        if(document.body.classList.contains('flat-mode')) {
            designToggle.checked = true;
        }

        designToggle.addEventListener('change', (e) => {
            if(e.target.checked) {
                document.body.classList.add('flat-mode');
            } else {
                document.body.classList.remove('flat-mode');
            }
        });
    }

    let swiper = null;

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

    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex=hex.slice(1);
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    // --- 通知ポップアップ制御 ---
    
    const notificationPopup = document.getElementById('header-notification-popup');
    const btnCloseNotif = document.querySelector('.btn-close-notification-popup');
    const btnGotoPwa = document.getElementById('btn-goto-pwa-test');

    if (btnHeaderNotification) {
        btnHeaderNotification.addEventListener('click', (e) => {
            e.stopPropagation(); 
            notificationPopup.classList.toggle('active');
            
            // タスクポップアップが開いていたら閉じる
            if(headerTaskPopup) headerTaskPopup.classList.remove('active');
        });
    }

    if(btnCloseNotif) {
        btnCloseNotif.addEventListener('click', () => {
            notificationPopup.classList.remove('active');
        });
    }

    // PWAテスト画面への遷移
    if(btnGotoPwa) {
        btnGotoPwa.addEventListener('click', () => {
            notificationPopup.classList.remove('active');
            switchScreen('notification-screen');
        });
    }
    
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
    
    const imageUploadInput = document.getElementById('image-upload-input');
    if(imageUploadInput) {
        const cropperWrapper = document.getElementById('cropper-wrapper');
        const imageToCrop = document.getElementById('image-to-crop');
        const btnCropImage = document.getElementById('btn-crop-image');
        const cropResultContainer = document.getElementById('crop-result-container');
        const cropResultImage = document.getElementById('crop-result-image');
        let cropper = null;

        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
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

// グローバル関数として定義
window.toggleUserType = function(btn) {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
};

// --- 追加: テーマ切り替え機能 ---
window.setTheme = function(themeName) {
    const body = document.body;
    
    // 既存のテーマクラスを全削除
    body.classList.remove('theme-vivid', 'theme-chic', 'theme-urban');
    
    // ボタンのactive状態を更新
    document.querySelectorAll('.btn-theme-switch').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });

    // 'default'以外なら該当クラスを付与
    if (themeName !== 'default') {
        body.classList.add('theme-' + themeName);
    }
    
    // Urbanモードなら明るさをリセット（見やすさのため）
    if (themeName === 'urban') {
        const bgLayer = document.getElementById('bg-layer');
        if(bgLayer) bgLayer.style.filter = 'brightness(100%)';
    }
    // --- 画像アップロード画面の制御 ---
    const imageUploadScreen = document.getElementById('image-upload-screen');
    const uploadGuideTitle = document.getElementById('upload-guide-title');
    const uploadGuideText = document.getElementById('upload-guide-text');
    const galleryInput = document.getElementById('gallery-image-input');
    const galleryCropperWrapper = document.getElementById('gallery-cropper-wrapper');
    const galleryImageToCrop = document.getElementById('gallery-image-to-crop');
    const btnConfirmCrop = document.getElementById('btn-confirm-crop');
    let galleryCropper = null;

    // アップロード画面を開く関数
    window.openImageUpload = function(guideName) {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 背景スクロール固定
            
            // ガイドテキストの更新
            if(uploadGuideText) {
                uploadGuideText.textContent = `ガイド: ${guideName}の写真`;
            }
            
            // 状態リセット
            if(galleryInput) galleryInput.value = '';
            if(galleryCropperWrapper) galleryCropperWrapper.style.display = 'none';
            if(btnConfirmCrop) btnConfirmCrop.style.display = 'none';
            if(galleryCropper) {
                galleryCropper.destroy();
                galleryCropper = null;
            }
        }
    };

    // アップロード画面を閉じる関数
    window.closeImageUpload = function() {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // 画像選択時の処理
    if(galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                // 前回のクロッパーがあれば破棄
                if (galleryCropper) {
                    galleryCropper.destroy();
                }

                galleryImageToCrop.src = event.target.result;
                galleryCropperWrapper.style.display = 'block';
                btnConfirmCrop.style.display = 'block';

                // Cropper.jsの起動
                galleryCropper = new Cropper(galleryImageToCrop, {
                    aspectRatio: 1,      // 正方形に固定
                    viewMode: 1,         // 画像枠内に制限
                    dragMode: 'move',    // 画像をドラッグ移動
                    autoCropArea: 1.0,   // 初期選択範囲を最大に
                    guides: true,        // ガイド線を表示
                    center: true,
                    highlight: false,
                    background: false,
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // 決定ボタン（デモ用アラート）
    if(btnConfirmCrop) {
        btnConfirmCrop.addEventListener('click', () => {
            if(!galleryCropper) return;
            // 切り取った画像データを取得
            const canvas = galleryCropper.getCroppedCanvas({
                width: 320, height: 320
            });
            
            // ここで本来はサーバー送信や画面反映を行う
            alert("切り取り完了！\n(このデモではここまでです)");
            closeImageUpload();
        });
    }
};
