document.addEventListener('DOMContentLoaded', () => {
    
    // --- 画面要素の取得 ---
    const screens = {
        home: document.getElementById('main-menu'),
        search: document.getElementById('search-screen'),
        notification: document.getElementById('notification-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        profile: document.getElementById('profile-screen'),
        form: document.getElementById('form-screen'), // モーダル
        swipe: document.getElementById('swipe-overlay')
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const popupOverlay = document.getElementById('popup-overlay');
    
    // FAB関連
    const btnFab = document.getElementById('fab-main'); 
    const fabSubmenu = document.getElementById('fab-submenu');
    const btnFindShop = document.getElementById('btn-find-shop');
    
    // サイドメニュー関連
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
    
    // --- 関数定義 ---

    // 画面切り替え (タスクバー用)
    function switchScreen(targetId) {
        // FABメニューを閉じる
        if(fabSubmenu) fabSubmenu.classList.remove('active');

        // 全画面非表示 (フォームとスワイプは特殊なので除外する場合もあるが、基本は消す)
        Object.values(screens).forEach(el => {
            if(el && el.id !== 'form-screen' && el.id !== 'swipe-overlay') {
                el.style.display = 'none';
            }
        });
        
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        // タスクバー更新
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        if (backToTopBtn) backToTopBtn.style.display = 'none';
    }

    // フォームモーダル表示/非表示
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
        // #を除去
        if (hex.startsWith('#')) hex = hex.slice(1);
        
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }


    // --- イベントリスナー登録 ---

    // タスクバー
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            switchScreen(target);
        });
    });

    // FAB制御
    if (btnFab) {
        btnFab.addEventListener('click', () => {
            fabSubmenu.classList.toggle('active');
        });
    }
    // 「お店を探す」 -> 検索画面へ
    if (btnFindShop) {
        btnFindShop.addEventListener('click', () => {
            switchScreen('search-screen');
        });
    }

    // フォーム表示 (FAB & ボタン)
    const openFormHandler = () => toggleFormModal(true);
    if (btnFormImage) btnFormImage.addEventListener('click', openFormHandler);
    
    // フォーム閉じる
    if (btnCloseForm) btnCloseForm.addEventListener('click', () => toggleFormModal(false));
    if (formOverlayBg) formOverlayBg.addEventListener('click', () => toggleFormModal(false));

    // ハンバーガーメニュー
    if (btnHamburger) btnHamburger.addEventListener('click', () => toggleSideMenu(true));
    if (btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));


    // --- Design Control ---
    
    // カラーテーマ
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
            // 背景グラデの終点を調整 (テーマに合わせるかアクセントに合わせるかは好みだが、ここではテーマに合わせる)
            // ただし、CSS側で var(--color-bg-start) と var(--color-accent) を混ぜている場合もあるため、
            // ここではCSS変数を更新する
            root.style.setProperty('--color-bg-end', end);

            // 文字色調整
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
            // 色コードを定義
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
            
            // アクセントカラー (背景グラデの終点にも使っている場合)
            root.style.setProperty('--color-accent', p);

            // 文字色もアクセントカラーに連動させる
            root.style.setProperty('--color-text-current', p);

            // ボタンの背景色を、アクセントカラーの薄い色に変更
            const lightBg = hexToLightRgba(p, 0.05); // 5%の不透明度
            root.style.setProperty('--color-btn-bg', lightBg);
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


    // --- 既存画面のイベント ---

    // スワイプ画面
    if (btnSwipeImage) btnSwipeImage.addEventListener('click', () => {
        if (screens.swipe) screens.swipe.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // 表示後にSwiper初期化
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
        switchScreen('main-menu'); // 戻る
    });

    // ポップアップ
    if (btnPopupImage) btnPopupImage.addEventListener('click', () => showPopup(true));
    const btnClosePopup = document.getElementById('btn-close-popup');
    const btnPopupCancel = document.getElementById('btn-popup-cancel');
    const btnPopupOk = document.getElementById('btn-popup-ok');
    if (btnClosePopup) btnClosePopup.addEventListener('click', () => showPopup(false));
    if (btnPopupCancel) btnPopupCancel.addEventListener('click', () => showPopup(false));
    if (btnPopupOk) btnPopupOk.addEventListener('click', () => showPopup(false));
    if (popupOverlay) popupOverlay.addEventListener('click', (e) => { if(e.target === popupOverlay) showPopup(false); });

    // プロフィール (メニュー内のボタンから)
    if (btnProfileImage) btnProfileImage.addEventListener('click', () => switchScreen('profile-screen'));
    
    // 通知テスト (メニュー内のボタンから)
    if (btnNotificationScreen) btnNotificationScreen.addEventListener('click', () => switchScreen('notification-screen'));

    // 戻るボタン (共通)
    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') {
            btn.addEventListener('click', () => switchScreen('main-menu'));
        }
    });

    // スクロールトップ
    window.onscroll = () => {
        if (backToTopBtn) {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            backToTopBtn.style.display = (scrollY > 100) ? 'block' : 'none';
        }
    };
    if (backToTopBtn) backToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    
    // Cropper
    const imageUploadInput = document.getElementById('image-upload-input');
    const cropperWrapper = document.getElementById('cropper-wrapper');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnCropImage = document.getElementById('btn-crop-image');
    const cropResultContainer = document.getElementById('crop-result-container');
    const cropResultImage = document.getElementById('crop-result-image');
    
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
