document.addEventListener('DOMContentLoaded', () => {

    // ★重要: GASのデプロイURL
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwhCJRu6BkSH61BEB3klXGUcPFIXlklKNk5Q8CNJ3EHdV5gByGT4H17BkfP76b-KWYv/exec'; 

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

    // --- 2. 変数定義 ---
    let currentMode = 'shop'; 
    let isGridView = false; 
    let swiper = null;

    const screens = {
        login: document.getElementById('login-screen'),
        home: document.getElementById('home-screen'),
        search: document.getElementById('search-screen'),
        favorite: document.getElementById('favorite-screen'),
        message: document.getElementById('message-screen'),
        mypage: document.getElementById('mypage-screen'),
        form: document.getElementById('form-screen'), 
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

    // --- 3. ログイン関連関数 ---

    // 起動時のチェック
    window.checkLoginSession = function() {
        const user = localStorage.getItem('misechoku_user');
        if (user) {
            // ログイン済みならホームへ
            const userData = JSON.parse(user);
            updateMypage(userData);
            skipLogin(); // UI遷移
        } else {
            // 未ログインならログイン画面のまま
        }
    }

    window.handleLogin = async function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = document.querySelector('#login-form button');

        if(!email || !password) {
            alert('入力してください');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '認証中...';

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors', // no-corsではレスポンスが読めないので、本来はCORS対応が必要
                                // ★GASのウェブアプリURLはCORS対応されていますが、redirectされます
                                // redirect: 'follow' を指定します
                redirect: 'follow',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // GAS用にtext/plain
                body: JSON.stringify({ action: 'login', email: email, password: password })
            });

            // no-corsだとレスポンスボディが読めないので、本来はここでJSONパースできません。
            // しかしGASウェブアプリ側で適切にCORSヘッダを返せば読めます。
            // モック環境での動作確認用に、簡易的なハンドリングを行います。
            
            // ★注意: GASのURLが正しい場合、通常はJSONが返ってきますが、
            // no-corsモードだと不透明なレスポンスになります。
            // 本格的なログイン実装では、GAS側で `ContentService` を返す際に
            // 適切なヘッダが必要ですが、ここでは簡易的に「エラーにならなければOK」とするか、
            // 完全にCORS対応したGAS URLを使う必要があります。
            
            // 今回はGAS側でJSONを返している想定で、no-corsを外してtryします。
            // もしCORSエラーが出る場合は、GAS側スクリプトの修正または
            // デモ用フォールバックを使用してください。

            // const data = await response.json(); // ここでエラーになる可能性があります

            // --- デモ用の一時的なフォールバックロジック ---
            // 通信が成功したかどうか判断しづらいため、特定のID/PASSなら通すデモモードを優先します
            if (email === 'demo@test.com' && password === 'demo') {
                const demoUser = { name: 'デモ太郎', email: email, icon: '' };
                localStorage.setItem('misechoku_user', JSON.stringify(demoUser));
                updateMypage(demoUser);
                skipLogin();
                return;
            }
            
            // 本来のGAS通信処理 (CORS設定が正しければこちら)
            /*
            const data = await response.json();
            if (data.result === 'success') {
                localStorage.setItem('misechoku_user', JSON.stringify(data.user));
                updateMypage(data.user);
                skipLogin();
            } else {
                alert('ログイン失敗: ' + (data.message || '不明なエラー'));
            }
            */
           
           // 現状のGASコードとの兼ね合いで、アラートを出します
           alert('現在、サーバー連携機能は調整中です。\nデモアカウント(demo@test.com / demo)でお試しください。');

        } catch (error) {
            console.error(error);
            alert('通信エラーが発生しました。デモ用アカウント(demo@test.com / demo)で試すか、GASのURLを確認してください。');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ログイン';
        }
    };

    window.handleLogout = function() {
        if(confirm('ログアウトしますか？')) {
            localStorage.removeItem('misechoku_user');
            location.reload(); // 画面リロードしてログイン画面へ
        }
    };

    window.skipLogin = function() {
        if (screens.login) screens.login.style.display = 'none';
        document.getElementById('global-header').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'flex';
        
        // fabコンテナの表示制御
        if(currentMode === 'shop' || currentMode === 'cast') { // 簡易的なチェック
             if(fabContainer) fabContainer.style.display = 'flex';
        }

        switchScreen('home-screen');
        // bodyのpaddingを戻す
        document.body.style.paddingTop = '60px';
        document.body.style.paddingBottom = '80px';
    };

    window.showRegisterModal = function() {
        if (screens.form) screens.form.style.display = 'block';
    };

    window.closeRegisterModal = function() {
        if (screens.form) screens.form.style.display = 'none';
    };

    // --- 4. 新規登録処理 (GAS連携) ---
    window.submitRegister = async function() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const fileInput = document.getElementById('image-upload-input');
        const file = fileInput ? fileInput.files[0] : null;

        if(!name || !email || !password) {
            alert('必須項目を入力してください');
            return;
        }

        const submitBtn = document.querySelector('.btn-submit-stylish');
        if(submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';
        }

        try {
            const payload = {
                action: 'register',
                name: name,
                email: email,
                password: password,
                image: '',
                mimeType: '',
                fileName: ''
            };

            if (file) {
                payload.image = await convertFileToBase64(file);
                payload.mimeType = file.type;
                payload.fileName = file.name;
            }

            // no-cors指定でPOST (レスポンスは読めないが送信はされる)
            // 実際に応答を受け取るにはGAS側でCORS対応が必要
            await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            // no-corsなので成功したとみなして進める（エラーハンドリングは限定的）
            alert('登録を受け付けました（デモ版のため自動ログインします）。');
            const newUser = { name: name, email: email, icon: '' }; // 画像URLは取得できないため空
            localStorage.setItem('misechoku_user', JSON.stringify(newUser));
            updateMypage(newUser);
            closeRegisterModal();
            skipLogin();

        } catch (error) {
            console.error(error);
            alert('送信エラー: ' + error);
        } finally {
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '登録する';
            }
        }
    };

    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // --- 5. 画面更新 ---
    function updateMypage(user) {
        if (!user) return;
        const nameEl = document.getElementById('mypage-name-display');
        const imgEl = document.getElementById('mypage-main-img');
        
        if (nameEl) nameEl.innerHTML = `${user.name} <span class="mypage-age">(Guest)</span>`;
        // iconがある場合のみ更新 (デモ登録時は空なので既存画像のままにする)
        if (imgEl && user.icon) imgEl.src = user.icon;
    }

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
                        <div class="timeline-like-btn" onclick="toggleLike(this)"><i class="far fa-heart"></i></div>
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

        // マイページ (ユーザー情報がある場合はそれを優先、なければダミー)
        // updateMypage() が別途呼ばれるので、ここでは画像のプレースホルダー的初期化のみ行う
        // ただし名前等はログイン情報で上書きされる前提
        const mypageMainImg = document.getElementById('mypage-main-img');
        if(mypageMainImg && !localStorage.getItem('misechoku_user')) {
             mypageMainImg.src = `${mypageData.pathPrefix}${mypageData.imgName(1)}`;
        }
        
        const mypageName = document.getElementById('mypage-name-display');
        if(mypageName && !localStorage.getItem('misechoku_user')) {
             mypageName.innerHTML = `${mypageData.items[0].name} <span class="mypage-age">${mypageData.items[0].age ? '('+mypageData.items[0].age+'歳)' : ''}</span>`;
        }

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

    // --- 6. 画面遷移 ---
    function switchScreen(targetId) {
        if (targetId === 'login-screen') return; // ログイン画面への直接遷移はしない

        // FABの表示制御
        if(targetId === 'home-screen' || targetId === 'search-screen' || targetId === 'favorite-screen') {
            if(fabContainer) fabContainer.style.display = 'flex';
        } else {
            if(fabContainer) fabContainer.style.display = 'none';
        }
        
        if(fabSubmenu) fabSubmenu.classList.remove('active');
        if(headerTaskPopup) headerTaskPopup.classList.remove('active');

        // ログイン画面以外を非表示にしてから対象を表示
        Object.values(screens).forEach(el => { 
            if(el && el.id !== 'login-screen') el.style.display = 'none'; 
        });
        
        const target = document.getElementById(targetId) || screens.home;
        if (target) target.style.display = 'block';
        window.scrollTo(0, 0);

        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    // --- 7. その他イベントリスナー (既存機能) ---
    
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

    const btnFabSearch = document.getElementById('btn-fab-search');
    if(btnFabSearch) {
        btnFabSearch.addEventListener('click', () => {
            if(searchDialog) searchDialog.style.display = 'flex';
            if(fabSubmenu) fabSubmenu.classList.remove('active');
        });
    }
    window.closeSearchDialog = function() {
        if(searchDialog) searchDialog.style.display = 'none';
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => switchScreen(item.getAttribute('data-target')));
    });

    if (btnHeaderNotification) {
        btnHeaderNotification.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const p = document.getElementById('header-notification-popup');
            if(p) p.classList.toggle('active');
        });
    }
    if (btnHeaderTask && headerTaskPopup) btnHeaderTask.addEventListener('click', () => headerTaskPopup.classList.toggle('active'));
    if (btnCloseTaskPopup && headerTaskPopup) btnCloseTaskPopup.addEventListener('click', () => headerTaskPopup.classList.remove('active'));
    
    if (btnPalette) btnPalette.addEventListener('click', () => toggleSideMenu());

    if(btnCloseSideMenu) btnCloseSideMenu.addEventListener('click', () => toggleSideMenu(false));
    if(sideMenuOverlay) sideMenuOverlay.addEventListener('click', () => toggleSideMenu(false));

    function toggleSideMenu(show) {
        if(!sideMenu) return;
        const isShow = (typeof show === 'boolean') ? show : !sideMenu.classList.contains('active');
        if (isShow) {
            if(sideMenuOverlay) sideMenuOverlay.style.display = 'block';
            sideMenu.classList.add('active');
        } else {
            if(sideMenuOverlay) sideMenuOverlay.style.display = 'none';
            sideMenu.classList.remove('active');
        }
    }

    // カラーピッカー関連 (既存機能)
    const updateColor = (varName, value) => {
        document.body.style.setProperty(varName, value);
    };
    const setupColorSync = (pickerId, textId, varName) => {
        const picker = document.getElementById(pickerId);
        const text = document.getElementById(textId);
        if(!picker || !text) return;

        picker.addEventListener('input', (e) => {
            text.value = e.target.value;
            updateColor(varName, e.target.value);
        });
        text.addEventListener('input', (e) => {
            const val = e.target.value;
            if(/^#[0-9A-F]{6}$/i.test(val)) {
                picker.value = val;
                updateColor(varName, val);
            }
        });
    };
    setupColorSync('color-main-picker', 'color-main-text', '--color-main');
    setupColorSync('color-sub-picker', 'color-sub-text', '--color-sub');
    setupColorSync('color-accent-picker', 'color-accent-text', '--color-accent');
    setupColorSync('color-text-picker', 'color-text-text', '--color-text-custom');

    // ガイド画像・吹き出し機能
    const guideImg = document.getElementById('guide-character');
    const guideBubble = document.getElementById('guide-speech-bubble');
    const guideImages = [
        'images/guide/okojyo.png', 'images/guide/fenex.png',
        'images/guide/piyoko.png', 'images/guide/piyota.png'
    ];
    let guideIndex = 0;

    if (guideImg) {
        guideImg.addEventListener('click', () => {
            guideIndex = (guideIndex + 1) % guideImages.length;
            guideImg.src = guideImages[guideIndex];
            guideImg.style.transform = 'scale(0.8)';
            setTimeout(() => { guideImg.style.transform = 'scale(1)'; }, 100);
        });
    }
    if (guideBubble) {
        guideBubble.addEventListener('click', () => {
            if(fabSubmenu) fabSubmenu.classList.toggle('active');
        });
    }

    // 画像アップロード (簡易版)
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

    // --- 初期化 ---
    // ログイン画面以外を非表示
    Object.values(screens).forEach(el => { if(el) el.style.display = 'none'; });
    if(screens.login) screens.login.style.display = 'flex';
    document.getElementById('global-header').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    if(fabContainer) fabContainer.style.display = 'none';

    // 初期実行
    checkLoginSession();
    renderContent();
    
    // 初期テーマ適用
    setTheme('Victoria');
});

// --- テーマ定義 (Design Control) ---
const THEMES = {
    'Gogh': { main: '#f6e599', sub: '#f9b83e', accent: '#064277', text: '#040a18' },
    'Rose': { main: '#a8998e', sub: '#404d3e', accent: '#610710', text: '#230f08' },
    'Hotel': { main: '#2c2c2c', sub: '#6c2735', accent: '#d4af37', text: '#f0f0f0' },
    'Chic': { main: '#e3e3b3', sub: '#d4af7f', accent: '#381a04', text: '#2e1d1a' },
    'Royal': { main: '#c7c7d9', sub: '#34346e', accent: '#857210', text: '#333333' },
    'Victoria': { main: '#003c41', sub: '#62613b', accent: '#98006a', text: '#8faba8' },
    'Neon': { main: '#000000', sub: '#7e2a41', accent: '#e2aa11', text: '#ffffff' }
};

window.setTheme = function(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    document.body.style.setProperty('--color-main', theme.main);
    document.body.style.setProperty('--color-sub', theme.sub);
    document.body.style.setProperty('--color-accent', theme.accent);
    document.body.style.setProperty('--color-text-custom', theme.text);

    // ピッカーとテキストの値を更新 (存在チェック付き)
    const updatePicker = (pickerId, textId, val) => {
        const p = document.getElementById(pickerId);
        const t = document.getElementById(textId);
        if(p) p.value = val;
        if(t) t.value = val;
    };
    updatePicker('color-main-picker', 'color-main-text', theme.main);
    updatePicker('color-sub-picker', 'color-sub-text', theme.sub);
    updatePicker('color-accent-picker', 'color-accent-text', theme.accent);
    updatePicker('color-text-picker', 'color-text-text', theme.text);

    document.querySelectorAll('.btn-theme-switch').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.theme === themeName) btn.classList.add('active');
    });
};

// --- グラデーション切り替え ---
window.toggleGradation = function(isAh) {
    if(isAh) document.body.classList.add('gradation-mode');
    else document.body.classList.remove('gradation-mode');
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
