document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素の取得 ---
    const mainMenu = document.getElementById('main-menu');
    const formScreen = document.getElementById('form-screen');
    const notificationScreen = document.getElementById('notification-screen');
    const swipeOverlay = document.getElementById('swipe-overlay');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    
    // ▼▼▼ スワイプコンテナ要素をここで取得 ▼▼▼
    const swiperContainer = document.querySelector('#swipe-overlay .swiper');
    // ▲▲▲

    // --- メインメニューのボタン ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnPopupImage = document.getElementById('btn-popup-image');

    // --- 各画面の「戻る」ボタン ---
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));

    // --- スワイプ関連 ---
    let swiper = null; 
    const closeSwipeBtn = document.getElementById('close-swipe-btn');

    // --- ポップアップ閉じるボタン ---
    const btnClosePopup = document.getElementById('btn-close-popup');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    
    // --- Cropper (画像切り抜き) 関連 ---
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
        if (backToTopBtn) backToTopBtn.style.display = 'none';

        if (screenToShow) {
            screenToShow.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }
    
    // --- ポップアップ表示/非表示 関数 ---
    function showPopup(show) {
        if (popupOverlay) {
            popupOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    // --- イベントリスナー設定 ---

    // 1. 「スワイプイメージ」ボタン
    if (btnSwipeImage) {
        btnSwipeImage.addEventListener('click', () => {
            if (swipeOverlay) swipeOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // ▼▼▼ 初期化方法を修正 ▼▼▼
            // (初期化がまだで、コンテナ要素が見つかっていれば)
            if (!swiper && swiperContainer) { 
                // セレクタ文字列ではなく、取得済みの「HTML要素オブジェクト」を渡す
                swiper = new Swiper(swiperContainer, { 
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
            if (swipeOverlay) swipeOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // 2. 「フォームイメージ」ボタン
    if (btnFormImage) {
        btnFormImage.addEventListener('click', () => {
            showScreen(formScreen);
        });
    }

    // 3. 「通知テスト」ボタン
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
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. 「ポップアップイメージ」ボタン
    if (btnPopupImage) {
        btnPopupImage.addEventListener('click', () => {
            showPopup(true);
        });
    }
    // (ポップアップを閉じるボタン群)
    if (btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if (btnPopupCancel) btnPopupCancel.addEventListener('click', () => showPopup(false));
    if (btnPopupOk) btnPopupOk.addEventListener('click', () => showPopup(false));
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                showPopup(false);
            }
        });
    }
    
    // 7. 画像アップロード (Cropper.js)
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                if (cropper) {
                    cropper.destroy();
                }
                
                imageToCrop.src = event.target.result;
                cropperWrapper.style.display = 'block';
                
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1 / 1, 
                    viewMode: 1, 
                    autoCropArea: 0.8, 
                    minCropBoxWidth: 320,
                    minCropBoxHeight: 320,
                    
                    ready() {
                        cropper.setCropBoxData({
                            width: 320,
                            height: 320
                        });
                    }
                });
                
                cropResultContainer.style.display = 'none'; 
            };
            reader.readAsDataURL(file);
        });
    }
    
    // (Cropper.js の切り抜き実行ボタン)
    if (btnCropImage) {
        btnCropImage.addEventListener('click', () => {
            if (!cropper) return;

            const croppedCanvas = cropper.getCroppedCanvas({
                width: 320,
                height: 320,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            if (!croppedCanvas) return;

            cropResultImage.src = croppedCanvas.toDataURL('image/png');
            cropResultContainer.style.display = 'block';
        });
    }

});