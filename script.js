document.addEventListener('DOMContentLoaded', () => {
    
    // --- データ定義 ---
    const appData = {
        shop: { // 店舗向けモード（タイムラインには女の子を表示）
            pathPrefix: 'images/girls/',
            imgName: (i) => `${i}.png`, // ※ファイル名が1.png等の場合
            items: [
                { id:1, name: 'あや', age: 22, text: '今から入れます！', time: '10分前' },
                { id:2, name: 'まる子', age: 20, text: '明日東京に戻ります。', time: '30分前' },
                { id:3, name: '舞', age: 24, text: '初心者です、いろいろ教えてください！', time: '1時間前' },
                { id:4, name: 'さくら', age: 21, text: 'もっと稼ぎたい～！', time: '3時間前' },
                { id:5, name: 'あおい', age: 23, text: '登録しました！', time: '昨日' },
                { id:6, name: 'リカ', age: 25, text: 'お家でまったりリラックスタイム', time: '昨日' }
            ]
        },
        cast: { // キャスト向けモード（タイムラインにはお店を表示）
            pathPrefix: 'images/omise/', 
            imgName: (i) => `${i}.png`, 
            items: [
                { id:1, name: 'CLUB SHINJUKU', age: null, text: '新規オープン祝い！時給5000円〜✨ 未経験者大歓迎！', time: '新着' },
                { id:2, name: 'Lounge Rose', age: null, text: '落ち着いた雰囲気の会員制ラウンジ🍷', time: '急募' },
                { id:3, name: 'Girls Bar PIYO', age: null, text: '私服OK！髪型ネイル自由💅 ゆるく働こう', time: '人気' },
                { id:4, name: 'Cabaret FLOWER', age: null, text: '豪華な内装と厚待遇💎 送りあり', time: '3時間前' },
                { id:5, name: 'Snack 昭和', age: null, text: '今週だけのヘルプさん大募集中！', time: '昨日' },
                { id:6, name: 'Bar BLUE', age: null, text: 'オープニングスタッフ募集！💙 駅チカ', time: '昨日' }
            ]
        }
    };

    // ファイル名の微調整（実際のファイル構成に合わせてください）
    appData.shop.imgName = (i) => `${i}.png`; 
    appData.cast.imgName = (i) => `${i}.png`; 

    let currentMode = 'shop'; // 初期モード

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
        upload: document.getElementById('image-upload-screen'),
        grid: document.getElementById('grid-list-screen') 
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
    
    const designToggle = document.getElementById('design-mode-toggle');

    const btnSwipeImage = document.getElementById('btn-swipe-image');
    const btnGridList = document.getElementById('btn-grid-list'); 
    const btnNotificationScreen = document.getElementById('btn-notification-screen');
    const btnRealSite = document.getElementById('btn-real-site');
    const btnRandom = document.getElementById('btn-random-color');

    const backButtons = Array.from(document.querySelectorAll('.btn-back-to-menu'));
    const btnBackHome = document.querySelector('.btn-back-home');
    const closeSwipeBtn = document.getElementById('btn-swipe-close');
    const btnCloseForm = document.querySelector('.btn-close-form');
    const formOverlayBg = document.querySelector('.form-overlay-bg');
    
    let swiper = null;

    // --- コンテンツ描画関数 ---
    function renderContent() {
        const viewData = appData[currentMode]; // タイムライン等の表示用データ
        // マイページ用データ（逆にする：店舗モードなら自分のページは店舗画像）
        const mypageMode = (currentMode === 'shop') ? 'cast' : 'shop';
        const mypageData = appData[mypageMode];
        
        // 1. スワイプスライド生成 (View Data)
        const swipeWrapper = document.getElementById('swipe-wrapper');
        if(swipeWrapper) {
            swipeWrapper.innerHTML = viewData.items.map((item, index) => `
                <div class="swiper-slide">
                    <div class="card-content">
                        <img src="${viewData.pathPrefix}${viewData.imgName(index + 1)}" alt="${item.name}" class="profile-image" onerror="this.src='images/girls/1.png'">
                        <div class="overlay"></div>
                        <div class="action-bar">
                            <div class="action-item side-action-btn"><i class="fas fa-heart icon-circle"></i><span class="action-label">いいね</span></div>
                            <div class="action-item side-action-btn"><i class="fas fa-bookmark icon-circle"></i><span class="action-label">保存</span></div>
                        </div>
                        <div class="profile-info-new">
                            <div class="user-name">${item.name} ${item.age ? '('+item.age+')' : ''}</div>
                            <div class="user-intro">${item.text}</div>
                        </div>
                        <div class="swipe-indicator"><i class="fas fa-chevron-up swipe-icon"></i><span class="swipe-text">SWIPE</span></div>
                    </div>
                </div>
            `).join('');
            if(swiper) { swiper.update(); swiper.slideTo(0); }
        }

        // 2. タイムライン生成 (View Data)
        const timelineContainer = document.getElementById('timeline-container');
        if(timelineContainer) {
            timelineContainer.innerHTML = viewData.items.map((item, index) => `
                <div class="timeline-item">
                    <div class="timeline-img-area" style="background-image: url('${viewData.pathPrefix}${viewData.imgName(index + 1)}');"></div>
                    <div class="timeline-content-area">
                        <div class="timeline-meta">
                            <span class="timeline-name">${item.name} ${item.age ? '('+item.age+')' : ''}</span>
                            <span class="timeline-date">${item.time}</span>
                        </div>
                        <div class="timeline-tweet">${item.text}</div>
                        <button class="timeline-like-btn" onclick="toggleLike(this)"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            `).join('');
        }

        // 3. チャットリスト生成 (View Data)
        const chatContainer = document.getElementById('chat-list-container');
        if(chatContainer) {
            chatContainer.innerHTML = viewData.items.slice(0, 3).map((item, index) => `
                <div class="chat-item">
                    <div class="chat-avatar" style="background-image: url('${viewData.pathPrefix}${viewData.imgName(index + 1)}');"></div>
                    <div class="chat-content">
                        <div class="chat-top"><h4 class="chat-name">${item.name}</h4><span class="chat-time">${item.time}</span></div>
                        <p class="chat-preview">${item.text}</p>
                    </div>
                    ${index===1 ? '<span class="chat-unread">1</span>' : ''}
                </div>
            `).join('');
        }

        // 4. EC風グリッド生成 (View Data)
        const ecGridContainer = document.getElementById('ec-grid-container');
        if(ecGridContainer) {
            ecGridContainer.innerHTML = viewData.items.map((item, index) => `
                <div class="ec-item">
                    <div class="ec-img-area" style="background-image: url('${viewData.pathPrefix}${viewData.imgName(index + 1)}');"></div>
                    <div class="ec-info-area">
                        <div class="ec-name">${item.name}</div>
                        <div class="ec-desc">${item.text}</div>
                    </div>
                </div>
            `).join('');
        }

        // 5. マイページ画像更新 (Mypage Data = Reverse of View Data)
        const mypageMainImg = document.getElementById('mypage-main-img');
        if(mypageMainImg) mypageMainImg.src = `${mypageData.pathPrefix}${mypageData.imgName(1)}`;
        const mypageName = document.getElementById('mypage-name-display');
        if(mypageName) mypageName.innerHTML = `${mypageData.items[0].name} <span class="mypage-age">${mypageData.items[0].age ? '('+mypageData.items[0].age+'歳)' : ''}</span>`;
        
        const mypageGallery1 = document.getElementById('mypage-gallery-1');
        if(mypageGallery1) mypageGallery1.style.backgroundImage = `url('${mypageData.pathPrefix}${mypageData.imgName(1)}')`;
        const mypageGallery2 = document.getElementById('mypage-gallery-2');
        if(mypageGallery2) mypageGallery2.style.backgroundImage = `url('${mypageData.pathPrefix}${mypageData.imgName(2)}')`;

        // マイページのガイドテキスト更新
        updateMypageGuides(mypageMode);
    }

    function updateMypageGuides(mypageMode) {
        // ガイドラベルの設定
        const labels = (mypageMode === 'cast') 
            ? ['外観', '内装', 'お気に入り', 'その他'] // Castデータ(お店)の場合のガイド
            : ['胸上', '全身', 'お気に入り', 'その他']; // Shopデータ(女の子)の場合のガイド
            
        for(let i=1; i<=4; i++) {
            const labelEl = document.getElementById(`guide-label-${i}`);
            if(labelEl) labelEl.textContent = labels[i-1];
        }
    }

    // 初期描画
    renderContent();

    // --- モード切り替え関数 ---
    window.toggleUserType = function(type) {
        currentMode = type;
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.type === type) btn.classList.add('active');
        });
        renderContent();
    };

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
    if(btnRealSite) btnRealSite.addEventListener('click', () => showRealPopup(true));
    if(btnGridList) btnGridList.addEventListener('click', () => switchScreen('grid-list-screen'));

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
                if(swiper) { swiper.destroy(); swiper = null; }
                swiper = new Swiper(container, { direction: 'vertical', mousewheel: true, grabCursor: true });
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

    backButtons.forEach(btn => {
        if (btn.id !== 'btn-swipe-close') btn.addEventListener('click', () => switchScreen('main-menu'));
    });
    if(btnBackHome) btnBackHome.addEventListener('click', () => switchScreen('main-menu'));
    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    // --- カラーパレット・デザイン設定 ---
    if(designToggle) {
        if(document.body.classList.contains('flat-mode')) designToggle.checked = true;
        designToggle.addEventListener('change', (e) => {
            if(e.target.checked) document.body.classList.add('flat-mode');
            else document.body.classList.remove('flat-mode');
        });
    }

    const updateColor = (varName, value) => {
        document.body.style.setProperty(varName, value, 'important');
        if (varName === '--color-accent') {
            document.body.style.setProperty('--color-text-current', value, 'important');
            document.body.style.setProperty('--color-btn-bg', hexToLightRgba(value, 0.05), 'important');
        }
    };

    if(pickerMain) pickerMain.addEventListener('input', (e) => updateColor('--color-main', e.target.value));
    if(pickerSub) pickerSub.addEventListener('input', (e) => updateColor('--color-sub', e.target.value));
    if(pickerAccent) pickerAccent.addEventListener('input', (e) => updateColor('--color-accent', e.target.value));

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

    // --- 画像切り抜き・アップロード画面ロジック ---
    const imageUploadScreen = document.getElementById('image-upload-screen');
    const uploadGuideText = document.getElementById('upload-guide-text');
    const galleryInput = document.getElementById('gallery-image-input');
    const galleryCropperWrapper = document.getElementById('gallery-cropper-wrapper');
    const galleryImageToCrop = document.getElementById('gallery-image-to-crop');
    const btnConfirmCrop = document.getElementById('btn-confirm-crop');
    const iconBg = document.getElementById('upload-guide-icon-bg');
    let galleryCropper = null;

    window.openImageUpload = function(guideType) {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
            
            // マイページモード(逆のユーザータイプ)を取得
            const mypageMode = (currentMode === 'shop') ? 'cast' : 'shop';
            let guideText = '';
            let iconClass = 'fas fa-camera'; // デフォルト

            // ガイドテキストとアイコンの決定
            if(mypageMode === 'cast') {
                // ユーザーは店舗(Shop Mode) -> マイページはお店(Cast Data) -> ガイドは外観・内装
                if(guideType === '1' || guideType === '外観') { guideText = '外観'; iconClass = 'fas fa-building'; }
                else if(guideType === '2' || guideType === '内装') { guideText = '内装'; iconClass = 'fas fa-couch'; }
                else { guideText = guideType; iconClass = 'fas fa-image'; }
            } else {
                // ユーザーはキャスト(Cast Mode) -> マイページは女の子(Shop Data) -> ガイドは胸上・全身
                if(guideType === '1' || guideType === '胸上') { guideText = '胸上'; iconClass = 'fas fa-user'; }
                else if(guideType === '2' || guideType === '全身') { guideText = '全身'; iconClass = 'fas fa-female'; }
                else { guideText = guideType; iconClass = 'fas fa-image'; }
            }

            if(guideType === '新規') {
                guideText = '新規画像';
                iconClass = 'fas fa-plus-circle';
            }

            if(uploadGuideText) uploadGuideText.textContent = guideText;
            if(iconBg) iconBg.innerHTML = `<i class="${iconClass}"></i>`;

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
    const bgLayer = document.getElementById('bg-layer');
    if(bgLayer) bgLayer.style.filter = 'brightness(100%)';
};

window.toggleLike = function(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if(btn.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
};
