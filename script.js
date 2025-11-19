document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素 ---
    // 画面はクラスや共通管理にしてループ処理した方が効率的ですが、今回はID列挙で対応
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        profile: document.getElementById('profile-screen'), // マイページ
        form: document.getElementById('form-screen'), // モーダル
        swipe: document.getElementById('swipe-overlay')
    };
    
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    const swiperContainer = document.querySelector('#swipe-overlay .swiper');
    
    // --- デザインコントロール ---
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnHamburger = document.getElementById('btn-hamburger'); 
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');
    const bgLayer = document.getElementById('bg-layer');
    const root = document.documentElement;

    // --- ナビゲーション ---
    const navItems = document.querySelectorAll('.nav-item');
    const btnFab = document.getElementById('fab-add');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');

    // --- 既存メニューボタン (メインメニュー内) ---
    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnFormImage = document.getElementById('btn-form-image'); // こちらも小窓を開くようにする
    const btnPopupImage = document.getElementById('btn-popup-image');
    const btnProfileImage = document.getElementById('btn-profile-image'); // こちらはタスクバー切替と同じ挙動に

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const closeSwipeBtn = document.getElementById('btn-swipe-close');

    // --- その他 (Cropper, Popup) ---
    let swiper = null; 
    let cropper = null; 
    const btnClosePopup = document.getElementById('btn-close-popup');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    const imageUploadInput = document.getElementById('image-upload-input');
    const cropperWrapper = document.getElementById('cropper-wrapper');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnCropImage = document.getElementById('btn-crop-image');
    const cropResultContainer = document.getElementById('crop-result-container');
    const cropResultImage = document.getElementById('crop-result-image');


    // --- 関数定義 ---

    // 画面切り替え (タスクバー用)
    function switchScreen(targetId) {
        // 全画面非表示
        Object.values(screens).forEach(el => {
            if(el && el.id !== 'form-screen' && el.id !== 'swipe-overlay') el.style.display = 'none';
        });
        
        // 指定画面表示
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        // タスクバーのactive切り替え
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // ホーム以外なら戻るボタン表示...はタスクバーがあるので不要かもしれないが、既存仕様維持なら
        // 今回はタスクバーがあるのでトップへ戻るボタンの制御のみにする
        if (backToTopBtn) backToTopBtn.style.display = 'none';
    }

    // フォームモーダル表示/非表示
    function toggleFormModal(show) {
        if (show) {
            screens.form.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 背景スクロール禁止
        } else {
            screens.form.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function showPopup(show) {
        if (popupOverlay) popupOverlay.style.display = show ? 'flex' : 'none';
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

    function hexToLightRgba(hex, alpha) {
        let r=0,g=0,b=0;
        if(hex.startsWith('#')) hex = hex.slice(1);
        if(hex.length===3){
            r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16);
        }else if(hex.length===6){
            r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    }


    // --- イベントリスナー登録 ---

    // タスクバー
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            switchScreen(target);
        });
    });

    // FAB & フォームボタン -> フォームモーダルを開く
    const openFormHandler = () => toggleFormModal(true);
    if (btnFab) btnFab.addEventListener('click', openFormHandler);
    if (btnFormImage) btnFormImage.addEventListener('click', openFormHandler);
    
    // フォーム閉じる
    if (btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if (formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));

    // ハンバーガーメニュー
    if (btnHamburger) btnHamburger.addEventListener('click', () => toggleSideMenu(true));
    if (btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    // デザインコントロール (カラーテーマ)
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
                default: return;
            }
            root.style.setProperty('--color-bg-start', start);
            root.style.setProperty('--color-bg-end', end);
            // 文字色調整は簡易版
            if(theme==='navy'){
                root.style.setProperty('--color-text', '#fff');
                root.style.setProperty('--color-text-brown', '#ffebcd');
            } else {
                root.style.setProperty('--color-text', '#333');
                root.style.setProperty('--color-text-brown', '#8B4513');
            }
        });
    });

    // アクセントカラー
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
                default: return;
            }
            root.style.setProperty('--color-primary', p);
            root.style.setProperty('--color-primary-dark', d);
            // ボタン背景を薄く
            root.style.setProperty('--color-btn-bg', p); 
            // ※元のCSS設計に合わせて文字色を白にするため、背景を濃い色にするか、薄い色+濃い文字にするか
            // 今回のCSS修正で .btn-menu の文字色は白(#FFF)にしたので、背景は濃い色のままでOK
            // もし薄い背景にしたい場合は hexToLightRgba を使う
        });
    });

    // デザインスタイル
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const s = e.target.getAttribute('data-style');
            document.body.classList.remove('flat-design', 'super-3d');
            if(s==='flat') document.body.classList.add('flat-design');
            else if(s==='super-3d') document.body.classList.add('super-3d');
        });
    });

    // 濃淡調整
    const adjustBrightness = (val) => {
        let currentFilter = bgLayer.style.filter || 'brightness(100%)';
        let match = currentFilter.match(/brightness\((\d+)%\)/);
        let currentVal = match ? parseInt(match[1]) : 100;
        let newVal = currentVal + val;
        if (newVal < 50) newVal = 50; if (newVal > 150) newVal = 150;
        bgLayer.style.filter = `brightness(${newVal}%)`;
    };
    document.getElementById('btn-lighten').addEventListener('click', () => adjustBrightness(10));
    document.getElementById('btn-darken').addEventListener('click', () => adjustBrightness(-10));
    document.getElementById('btn-reset-brightness').addEventListener('click', () => {
        bgLayer.style.filter = 'brightness(100%)';
    });

    // スワイプ
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
        switchScreen('main-menu'); // 戻る
    });

    // ポップアップ
    if (btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    if (btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if (btnPopupCancel) btnPopupCancel.addEventListener('click', () => showPopup(false));
    if (btnPopupOk) btnPopupOk.addEventListener('click', () => showPopup(false));
    if (popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target === popupOverlay) showPopup(false); });

    // プロフィールボタン (メインメニューの)
    if (btnProfileImage) btnProfileImage.addEventListener('click', () => switchScreen('profile-screen'));

    // 戻るボタン (各画面左上)
    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') {
            btn.addEventListener('click', () => switchScreen('main-menu'));
        }
    });

    // スクロールトップボタン
    window.onscroll = () => {
        if (backToTopBtn) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Cropper
    if (imageUploadInput) {
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
    }
    if (btnCropImage) btnCropImage.addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({ width: 320, height: 320, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
        if (canvas) {
            cropResultImage.src = canvas.toDataURL('image/png');
            cropResultContainer.style.display = 'block';
        }
    });
    
    // ツールチップ
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
