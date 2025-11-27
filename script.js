document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. データ定義 ---
    const appData = {
        shop: { 
            pathPrefix: 'images/girls/',
            imgName: (i) => `${i}.png`, 
            items: [
                { id:1, name: 'あや', age: 22, text: '今から入れます！', time: '10分前' },
                { id:2, name: 'まる子', age: 20, text: '明日東京に戻ります。', time: '30分前' },
                { id:3, name: '舞', age: 24, text: '初心者です、いろいろ教えてください！', time: '1時間前' },
                { id:4, name: 'さくら', age: 21, text: 'もっと稼ぎたい～！', time: '3時間前' },
                { id:5, name: 'あおい', age: 23, text: '登録しました！', time: '昨日' },
                { id:6, name: 'リカ', age: 25, text: 'お家でまったりリラックスタイム', time: '昨日' }
            ]
        },
        cast: { 
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

    appData.shop.imgName = (i) => `${i}.png`; 
    appData.cast.imgName = (i) => `${i}.png`; 

    // --- 2. 変数定義 ---
    let currentMode = 'shop'; 
    let isGridView = false; 

    const screens = {
        home: document.getElementById('home-screen'),
        search: document.getElementById('search-screen'),
        favorite: document.getElementById('favorite-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        form: document.getElementById('form-screen'), 
        error: document.getElementById('error-screen'),
        notification: document.getElementById('notification-screen'),
        upload: document.getElementById('image-upload-screen')
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const fabContainer = document.getElementById('fab-container');
    const fabSubmenu = document.getElementById('fab-submenu');
    
    const sideMenu = document.getElementById('side-menu');
    const sideMenuOverlay = document.getElementById('side-menu-overlay');
    const btnPalette = document.getElementById('btn-palette');
    const btnCloseSideMenu = document.getElementById('btn-close-side-menu');

    const btnHeaderNotification = document.getElementById('btn-header-notification');
    const btnHeaderTask = document.getElementById('btn-header-task');
    const btnCloseTaskPopup = document.querySelector('.btn-close-task-popup');
    const headerTaskPopup = document.getElementById('header-task-popup');
    const searchDialog = document.getElementById('search-dialog');

    let swiper = null;

    // --- 3. 関数定義 ---
    function renderContent() {
        const viewData = appData[currentMode];
        const mypageMode = (currentMode === 'shop') ? 'cast' : 'shop';
        const mypageData = appData[mypageMode];
        
        // スワイプ画面
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
            else {
                const container = document.querySelector('#home-screen .swiper');
                if(container) swiper = new Swiper(container, { direction: 'vertical', mousewheel: true, grabCursor: true });
            }
        }

        // タイムライン
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

        // グリッド
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

        // チャット
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

        // マイページ
        const mypageMainImg = document.getElementById('mypage-main-img');
        if(mypageMainImg) mypageMainImg.src = `${mypageData.pathPrefix}${mypageData.imgName(1)}`;
        const mypageName = document.getElementById('mypage-name-display');
        if(mypageName) mypageName.innerHTML = `${mypageData.items[0].name} <span class="mypage-age">${mypageData.items[0].age ? '('+mypageData.items[0].age+'歳)' : ''}</span>`;
        const mypageGallery1 = document.getElementById('mypage-gallery-1');
        if(mypageGallery1) mypageGallery1.style.backgroundImage = `url('${mypageData.pathPrefix}${mypageData.imgName(1)}')`;
        const mypageGallery2 = document.getElementById('mypage-gallery-2');
        if(mypageGallery2) mypageGallery2.style.backgroundImage = `url('${mypageData.pathPrefix}${mypageData.imgName(2)}')`;

        updateMypageGuides(mypageMode);
    }

    function updateMypageGuides(mypageMode) {
        const labels = (mypageMode === 'cast') 
            ? ['外観', '内装', 'お気に入り', 'その他'] 
            : ['胸上', '全身', 'お気に入り', 'その他'];
        for(let i=1; i<=4; i++) {
            const labelEl = document.getElementById(`guide-label-${i}`);
            if(labelEl) labelEl.textContent = labels[i-1];
        }
    }

    // --- 4. 実行・イベントリスナー ---
    renderContent();

    window.toggleUserType = function(type) {
        currentMode = type;
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.type === type) btn.classList.add('active');
        });
        renderContent();
    };

    window.toggleTimelineView = function() {
        isGridView = !isGridView;
        const listContainer = document.getElementById('timeline-container');
        const gridContainer = document.getElementById('ec-grid-container');
        const btnText = document.getElementById('view-mode-text');
        const btnIcon = document.querySelector('#btn-toggle-view i');

        if (isGridView) {
            listContainer.style.display = 'none';
            gridContainer.style.display = 'grid';
            btnText.textContent = 'グリッド';
            btnIcon.className = 'fas fa-list';
        } else {
            listContainer.style.display = 'flex';
            gridContainer.style.display = 'none';
            btnText.textContent = 'リスト';
            btnIcon.className = 'fas fa-th-large';
        }
    };

    function switchScreen(targetId) {
        if(targetId === 'home-screen' || targetId === 'search-screen' || targetId === 'favorite-screen') {
            fabContainer.style.display = 'flex';
        } else {
            fabContainer.style.display = 'none';
        }
        
        if(fabSubmenu) fabSubmenu.classList.remove('active');
        if(headerTaskPopup) headerTaskPopup.classList.remove('active');

        Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
        
        const target = document.getElementById(targetId) || screens.home;
        target.style.display = 'block';
        window.scrollTo(0, 0);

        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    switchScreen('home-screen');

    const btnFabSearch = document.getElementById('btn-fab-search');
    if(btnFabSearch) {
        btnFabSearch.addEventListener('click', () => {
            searchDialog.style.display = 'flex';
            fabSubmenu.classList.remove('active');
        });
    }
    window.closeSearchDialog = function() {
        searchDialog.style.display = 'none';
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    if (btnHeaderNotification) {
        btnHeaderNotification.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const p = document.getElementById('header-notification-popup');
            p.classList.toggle('active');
        });
    }
    if (btnHeaderTask) btnHeaderTask.addEventListener('click', () => headerTaskPopup.classList.toggle('active'));
    if (btnCloseTaskPopup) btnCloseTaskPopup.addEventListener('click', () => headerTaskPopup.classList.remove('active'));
    
    if (btnPalette) btnPalette.addEventListener('click', () => toggleSideMenu());

    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    function toggleSideMenu(show) {
        const isShow = (typeof show === 'boolean') ? show : !sideMenu.classList.contains('active');
        if (isShow) {
            sideMenuOverlay.style.display = 'block';
            sideMenu.classList.add('active');
        } else {
            sideMenuOverlay.style.display = 'none';
            sideMenu.classList.remove('active');
        }
    }

    // --- カラーピッカー関連 ---
    const updateColor = (varName, value) => {
        document.body.style.setProperty(varName, value);
    };
    const pickerMain = document.getElementById('color-main-picker');
    const pickerSub = document.getElementById('color-sub-picker');
    const pickerAccent = document.getElementById('color-accent-picker');
    const pickerText = document.getElementById('color-text-picker');

    if(pickerMain) pickerMain.addEventListener('input', (e) => updateColor('--color-main', e.target.value));
    if(pickerSub) pickerSub.addEventListener('input', (e) => updateColor('--color-sub', e.target.value));
    if(pickerAccent) pickerAccent.addEventListener('input', (e) => updateColor('--color-accent', e.target.value));
    if(pickerText) pickerText.addEventListener('input', (e) => updateColor('--color-text-custom', e.target.value));

    // ガイド画像・吹き出し機能
    const guideImg = document.getElementById('guide-character');
    const guideBubble = document.getElementById('guide-speech-bubble');
    
    // 画像切り替え
    const guideImages = [
        'images/guide/okojyo.png', 
        'images/guide/fenex.png',
        'images/guide/piyoko.png',
        'images/guide/piyota.png'
    ];
    let guideIndex = 0;

    if (guideImg) {
        guideImg.addEventListener('click', () => {
            guideIndex = (guideIndex + 1) % guideImages.length;
            guideImg.src = guideImages[guideIndex];
            guideImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                guideImg.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // 吹き出しクリックでメニュー開閉
    if (guideBubble) {
        guideBubble.addEventListener('click', () => {
            fabSubmenu.classList.toggle('active');
        });
    }

    // 画像アップロード (省略なし)
    const imageUploadScreen = document.getElementById('image-upload-screen');
    const uploadGuideText = document.getElementById('upload-guide-text');
    const iconBg = document.getElementById('upload-guide-icon-bg');
    
    window.openImageUpload = function(guideType) {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
            
            const mypageMode = (currentMode === 'shop') ? 'cast' : 'shop';
            let guideText = '';
            let iconClass = 'fas fa-camera';

            if(mypageMode === 'cast') {
                if(guideType === '1' || guideType === '外観') { guideText = '外観'; iconClass = 'fas fa-building'; }
                else if(guideType === '2' || guideType === '内装') { guideText = '内装'; iconClass = 'fas fa-couch'; }
                else { guideText = guideType; iconClass = 'fas fa-image'; }
            } else {
                if(guideType === '1' || guideType === '胸上') { guideText = '胸上'; iconClass = 'fas fa-user'; }
                else if(guideType === '2' || guideType === '全身') { guideText = '全身'; iconClass = 'fas fa-female'; }
                else { guideText = guideType; iconClass = 'fas fa-image'; }
            }
            if(guideType === '新規') { guideText = '新規画像'; iconClass = 'fas fa-plus-circle'; }

            if(uploadGuideText) uploadGuideText.textContent = guideText;
            if(iconBg) iconBg.innerHTML = `<i class="${iconClass}"></i>`;
        }
    };
    window.closeImageUpload = function() {
        if(imageUploadScreen) {
            imageUploadScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});

// --- テーマ定義 (Design Control) ---
const THEMES = {
    'Rose': {
        main: '#404d3e',   
        sub: '#77342f',    
        accent: '#230f08', 
        text: '#b8c4ba'
    },
    'Hotel': {
        main: '#2c2c2c',   
        sub: '#1a1a1a',    
        accent: '#d4af37', 
        text: '#f0f0f0'    
    },
    'Chic': {
        main: '#f5f5dc',   
        sub: '#d2b48c',    
        accent: '#8b4513', 
        text: '#3e2723'    
    },
    'Royal': {
        main: '#f8f8ff',   
        sub: '#000080',    
        accent: '#ffd700', 
        text: '#333333'
    },
    'Victoria': {
        main: '#fffff0',   
        sub: '#006400',    
        accent: '#800000', 
        text: '#333333'
    },
    'Neon': {
        main: '#000000',   
        sub: '#191970',    
        accent: '#00ff00', 
        text: '#ffffff'
    }
};

let currentThemeName = 'Rose'; 

window.setTheme = function(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    currentThemeName = themeName;
    
    // CSS変数を更新
    document.body.style.setProperty('--color-main', theme.main);
    document.body.style.setProperty('--color-sub', theme.sub);
    document.body.style.setProperty('--color-accent', theme.accent);
    document.body.style.setProperty('--color-text-custom', theme.text);

    // ピッカーの値も更新
    const pickerMain = document.getElementById('color-main-picker');
    const pickerSub = document.getElementById('color-sub-picker');
    const pickerAccent = document.getElementById('color-accent-picker');
    const pickerText = document.getElementById('color-text-picker');
    
    if(pickerMain) pickerMain.value = theme.main;
    if(pickerSub) pickerSub.value = theme.sub;
    if(pickerAccent) pickerAccent.value = theme.accent;
    if(pickerText) pickerText.value = theme.text;

    // ボタンのアクティブ表示切替
    document.querySelectorAll('.btn-theme-switch').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.theme === themeName) btn.classList.add('active');
    });
};

// --- フォント設定 ---
const FONTS = {
    'round': { header: "'Zen Maru Gothic', sans-serif", body: "'Zen Maru Gothic', sans-serif" },
    'mincho': { header: "'Shippori Mincho', serif", body: "'Shippori Mincho', serif" },
    'gothic': { header: "'Noto Sans JP', sans-serif", body: "'Noto Sans JP', sans-serif" }
};

window.setFont = function(fontType) {
    const font = FONTS[fontType];
    if(!font) return;

    document.body.style.setProperty('--font-header', font.header);
    document.body.style.setProperty('--font-body', font.body);

    document.querySelectorAll('.btn-font-switch').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.font === fontType) btn.classList.add('active');
    });
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
