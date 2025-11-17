document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素の取得 ---
    const mainMenu = document.getElementById('main-menu');
    const formScreen = document.getElementById('form-screen');
    const notificationScreen = document.getElementById('notification-screen');
    const swipeOverlay = document.getElementById('swipe-overlay');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    
    // ★追加★ ポップアップ要素
    const popupOverlay = document.getElementById('popup-overlay');
    
    // --- メインメニューのボタン ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image');
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    
    // ★追加★ ポップアップボタン
    const btnPopupImage = document.getElementById('btn-popup-image');

    // --- 各画面の「戻る」ボタン ---
    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));

    // --- スワイプ関連 ---
    let swiper = null; 
    const closeSwipeBtn = document.getElementById('close-swipe-btn');

    // ★追加★ ポップアップ閉じるボタン
    const btnClosePopup = document.getElementById('btn-close-popup');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    
    // ★追加★ Cropper (画像切り抜き) 関連
    const imageUploadInput = document.getElementById('image-upload-input');
    const cropperWrapper = document.getElementById('cropper-wrapper');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnCropImage = document.getElementById('btn-crop-image');
    const cropResultContainer = document.getElementById('crop-result-container');
    const cropResultImage = document.getElementById('crop-result-image');
    let cropper = null; // Cropperのインスタンス

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
    
    // ★追加★ ポップアップ表示/非表示 関数
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
            
            if (!swiper) { 
                swiper = new Swiper('#swipe-overlay .swiper', { 
                    direction: 'vertical',
                    mousewheel: true,
                    grabCursor: true,
                });
            }
        });
    }
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

    // 6. ★追加★ 「ポップアップイメージ」ボタン
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
            // オーバーレイの背景クリックでも閉じる
            if (e.target === popupOverlay) {
                showPopup(false);
            }
        });
    }
    
    // 7. ★追加★ 画像アップロード (Cropper.js)
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                // 既存のCropperインスタンスがあれば破棄
                if (cropper) {
                    cropper.destroy();
                }
                
                // 画像をセット
                imageToCrop.src = event.target.result;
                cropperWrapper.style.display = 'block';
                
                // Cropper.js を初期化
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1 / 1, // 1:1 (正方形)
                    viewMode: 1, // 0: 制限なし, 1: 画像内にクロップボックスを制限
                    autoCropArea: 0.8, // 自動クロップエリアのサイズ
                    
                    // 320x320のガイド表示 (注: 最小サイズとして設定)
                    minCropBoxWidth: 320,
                    minCropBoxHeight: 320,
                    
                    ready() {
                        // 320x320のボックスを中央にセットしようと試みる
                        cropper.setCropBoxData({
                            width: 320,
                            height: 320
                        });
                    }
                });
                
                cropResultContainer.style.display = 'none'; // 結果を隠す
            };
            reader.readAsDataURL(file);
        });
    }
    
    // (Cropper.js の切り抜き実行ボタン)
    if (btnCropImage) {
        btnCropImage.addEventListener('click', () => {
            if (!cropper) return;

            // 320x320ピクセルでキャンバスを取得
            const croppedCanvas = cropper.getCroppedCanvas({
                width: 320,
                height: 320,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            if (!croppedCanvas) return;

            // 結果をプレビュー用imgに設定
            cropResultImage.src = croppedCanvas.toDataURL('image/png');
            cropResultContainer.style.display = 'block';
            
            // Cropperを非表示にする (任意)
            // cropperWrapper.style.display = 'none';
        });
    }

});