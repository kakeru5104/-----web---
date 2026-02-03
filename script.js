
// メニュー
const menu = document.getElementById('mobileMenu');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');

menuBtn.addEventListener('click', () => {
    menu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('active');
});

// リンクを押したら閉じる
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});


// スクロールアニメーション
const targets = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

targets.forEach(target => {
    observer.observe(target);
});


// チケット抽選
const ticketBtn = document.getElementById('lotteryBtn');
const modal = document.getElementById('winModal');
const modalClose = document.getElementById('closeModal');

ticketBtn.addEventListener('click', () => {
    // ボタンの見た目変更
    const defaultText = ticketBtn.innerHTML;
    ticketBtn.innerHTML = 'JUDGING...<span class="small">抽選中...</span>';
    ticketBtn.style.opacity = '0.8';
    ticketBtn.style.pointerEvents = 'none';

    // 3秒後に結果表示
    setTimeout(() => {
        modal.classList.add('active');
        
        // ボタンを元に戻す
        ticketBtn.innerHTML = defaultText;
        ticketBtn.style.opacity = '1';
        ticketBtn.style.pointerEvents = 'auto';
    }, 3000);
});

// モーダル閉じる
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

/* script.js の一番下（グッズ機能）をこれに書き換え */

// === グッズ詳細ポップアップ機能 ===
const goodsItems = document.querySelectorAll('.goods-item');
const goodsModal = document.getElementById('goodsModal');
const closeGoodsModal = document.getElementById('closeGoodsModal');

// モーダル内の要素
const modalImg = document.getElementById('modalGoodsImg');
const modalName = document.getElementById('modalGoodsName');
const modalVar = document.getElementById('modalGoodsVar');
const modalPrice = document.getElementById('modalGoodsPrice');
const modalDesc = document.getElementById('modalGoodsDesc'); // ★追加

// 各グッズをクリックした時の動作
goodsItems.forEach(item => {
    item.addEventListener('click', () => {
        // クリックされたアイテムの中身を取得
        const img = item.querySelector('.goods-img').src;
        const name = item.querySelector('.goods-name').innerHTML;
        const variant = item.querySelector('.goods-var').textContent;
        const price = item.querySelector('.goods-price').textContent;
        // ★追加：隠し説明文を取得
        const desc = item.querySelector('.goods-desc-source').innerHTML;

        // モーダルにセット
        modalImg.src = img;
        modalName.innerHTML = name;
        modalVar.textContent = variant;
        modalPrice.textContent = price;
        modalDesc.innerHTML = desc; // ★追加：説明文をセット

        // モーダルを表示
        goodsModal.classList.add('active');
    });
});

// 閉じるボタン
if (closeGoodsModal) {
    closeGoodsModal.addEventListener('click', () => {
        goodsModal.classList.remove('active');
    });
}

// 背景クリックで閉じる
goodsModal.addEventListener('click', (e) => {
    if (e.target === goodsModal) {
        goodsModal.classList.remove('active');
    }
});

/* script.js の一番下に追加 */

// =========================================
// 4. 掲示板機能 (Supabase)
// =========================================

// ★ここにSupabaseの情報を貼り付けてください
const SUPABASE_URL = 'https://ydfkopqlsrcqnwmnnbuu.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_l8x_Jv7FqUo0K-EJadAjwQ_e5_vL-9w'; // anon key

// Supabaseクライアントの作成
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================================
// 4. BBS機能 (トップ3件 + モーダル全件版)
// =========================================

const bbsNameInput = document.getElementById('bbsName');
const bbsContentInput = document.getElementById('bbsContent');
const bbsSendBtn = document.getElementById('bbsSendBtn');
const bbsListEl = document.getElementById('bbsList'); // トップページ用
const bbsAllListEl = document.getElementById('bbsAllList'); // モーダル用

// モーダル制御
const openBbsModalBtn = document.getElementById('openBbsModal');
const bbsModal = document.getElementById('bbsModal');
const closeBbsModalBtn = document.getElementById('closeBbsModal');

if (openBbsModalBtn) {
    openBbsModalBtn.addEventListener('click', () => bbsModal.classList.add('active'));
    closeBbsModalBtn.addEventListener('click', () => bbsModal.classList.remove('active'));
    bbsModal.addEventListener('click', (e) => {
        if(e.target === bbsModal) bbsModal.classList.remove('active');
    });
}

// 読み込み関数
async function fetchBbs() {
    // コンテナをクリア
    bbsListEl.innerHTML = '<p class="loading-msg">Loading...</p>';
    if(bbsAllListEl) bbsAllListEl.innerHTML = '';

    // ★ここを修正しました： 'bbs_comments' → 'comments'
    const { data, error } = await sb
        .from('comments') 
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        bbsListEl.innerHTML = '<p>Error loading comments.</p>';
        return;
    }

    bbsListEl.innerHTML = ''; // Loadingを消す

    // --- 1. トップページ用 (最初の3つだけ) ---
    const top3 = data.slice(0, 3); 
    top3.forEach(comment => {
        const item = createBbsElement(comment);
        bbsListEl.appendChild(item);
    });

    // --- 2. モーダル用 (全件) ---
    if (bbsAllListEl) {
        data.forEach(comment => {
            const item = createBbsElement(comment);
            bbsAllListEl.appendChild(item);
        });
    }
}

// 吹き出し要素を作る便利関数
function createBbsElement(comment) {
    const div = document.createElement('div');
    div.classList.add('bbs-item'); 

    // 日付をフォーマット
    const dateObj = new Date(comment.created_at);
    const dateStr = `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    // XSS対策（名前がない場合の処理なども追加）
    const safeName = comment.name ? escapeHtml(comment.name) : '名無し';
    const safeContent = comment.content ? escapeHtml(comment.content) : '';

    div.innerHTML = `
        <div class="bbs-meta">
            <span class="bbs-date">${dateStr}</span>
            <span class="bbs-name">${safeName}</span>
        </div>
        <p class="bbs-text">${safeContent}</p>
    `;
    return div;
}

// HTMLエスケープ処理
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// 送信ボタンクリック
bbsSendBtn.addEventListener('click', async () => {
    const name = bbsNameInput.value.trim();
    const content = bbsContentInput.value.trim();

    if (!content) {
        alert('メッセージを入力してください');
        return;
    }

    // ★ここも修正しました： 'bbs_comments' → 'comments'
    const { error } = await sb
        .from('comments')
        .insert([{ name: name || '名無し', content: content }]);

    if (error) {
        console.error('Add Error:', error);
        alert('送信に失敗しました');
    } else {
        // 成功したら入力欄を空にして再読み込み
        bbsNameInput.value = '';
        bbsContentInput.value = '';
        fetchBbs(); 
        alert('メッセージを送信しました！');
    }
});

// 初回読み込み
fetchBbs();

/* script.js の一番下に追加 */

// === アプリ導入ガイドモーダル ===
const openAppModalBtn = document.getElementById('openAppModal');
const appModal = document.getElementById('appModal');
const closeAppModalBtn = document.getElementById('closeAppModal');

if (openAppModalBtn) {
    // NEWSをクリックしたら開く
    openAppModalBtn.addEventListener('click', (e) => {
        e.preventDefault(); // リンクの動きを止める
        appModal.classList.add('active');
    });

    // CLOSEボタンで閉じる
    closeAppModalBtn.addEventListener('click', () => {
        appModal.classList.remove('active');
    });

    // 背景クリックで閉じる
    appModal.addEventListener('click', (e) => {
        if (e.target === appModal) {
            appModal.classList.remove('active');
        }
    });
}


// =========================================
// 5. GAME機能 (リスト選択・決定ボタン式)
// =========================================

// ★解禁日時
const GAME_RELEASE_DATE = new Date("2026-03-21T18:00:00"); 

// ★クイズデータ（17人分）
const allMemberQuizData = {
    // --- 1人目 ---
    "田中 太郎": [
        { q: "田中の出身地は？", options: ["大阪", "兵庫", "京都", "奈良"], answer: "兵庫" },
        { q: "好きな食べ物は？", options: ["カレー", "寿司", "ラーメン", "焼肉"], answer: "ラーメン" },
        { q: "担当楽器は？", options: ["Gt", "Ba", "Dr", "Vo"], answer: "Vo" },
        { q: "愛用している機材メーカーは？", options: ["Fender", "Gibson", "Yamaha", "Ibanez"], answer: "Fender" },
        { q: "誕生日は？", options: ["1月1日", "4月1日", "7月7日", "12月25日"], answer: "1月1日" },
        { q: "座右の銘は？", options: ["一石二鳥", "七転八起", "焼肉定食", "一期一会"], answer: "七転八起" },
        { q: "飼っているペットは？", options: ["犬", "猫", "ハムスター", "いない"], answer: "猫" },
        { q: "初恋の相手の名前は？", options: ["花子", "愛子", "良子", "秘密"], answer: "秘密" },
    ],

        "長谷川　近似": [
        { q: "田中の出身地は？", options: ["大阪", "兵庫", "京都", "奈良"], answer: "兵庫" },
        { q: "好きな食べ物は？", options: ["カレー", "寿司", "ラーメン", "焼肉"], answer: "ラーメン" },
        { q: "担当楽器は？", options: ["Gt", "Ba", "Dr", "Vo"], answer: "Vo" },
        { q: "愛用している機材メーカーは？", options: ["Fender", "Gibson", "Yamaha", "Ibanez"], answer: "Fender" },
        { q: "誕生日は？", options: ["1月1日", "4月1日", "7月7日", "12月25日"], answer: "1月1日" },
        { q: "座右の銘は？", options: ["一石二鳥", "七転八起", "焼肉定食", "一期一会"], answer: "七転八起" },
        { q: "飼っているペットは？", options: ["犬", "猫", "ハムスター", "いない"], answer: "猫" },
        { q: "初恋の相手の名前は？", options: ["花子", "愛子", "良子", "秘密"], answer: "秘密" },
    ],
    // ※ここに残り16人分を追加してください
};

// 変数
let currentMemberName = "";
let currentQuizList = [];
let currentQuizIndex = 0;
let userAnswers = []; // ユーザーの回答を記録する配列
let playerName = "";
let selectedOption = null; // 現在選んでいる選択肢

// 画面要素
const screenStart = document.getElementById('gameStart');
const screenSelect = document.getElementById('gameSelectMember');
const screenQuiz = document.getElementById('gameQuiz');
const screenResultNormal = document.getElementById('gameResultNormal');
const screenResultSpecial = document.getElementById('gameResultSpecial');

const memberListEl = document.getElementById('memberList');
const btnQuizNext = document.getElementById('btnQuizNext');

// 時間チェック
function checkGameRelease() {
    const now = new Date();
    const lockedDiv = document.getElementById('gameLocked');
    const unlockedDiv = document.getElementById('gameUnlocked');
    if (now >= GAME_RELEASE_DATE) {
        if(lockedDiv) lockedDiv.style.display = 'none';
        if(unlockedDiv) unlockedDiv.style.display = 'block';
    } else {
        if(lockedDiv) lockedDiv.style.display = 'block';
        if(unlockedDiv) unlockedDiv.style.display = 'none';
    }
}
checkGameRelease();

// 画面切り替え
function showScreen(screen) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// 1. スタート → メンバー選択へ
document.getElementById('btnToSelect').addEventListener('click', () => {
    const name = document.getElementById('gamePlayerName').value.trim();
    if (!name) { alert("名前を入力してください！"); return; }
    playerName = name;
    createMemberList();
    showScreen(screenSelect);
});

// リスト生成
function createMemberList() {
    memberListEl.innerHTML = "";
    Object.keys(allMemberQuizData).forEach(memberName => {
        // リストアイテムを作成
        const item = document.createElement('div');
        item.classList.add('member-list-item');
        item.textContent = memberName;
        
        // クリックでクイズ開始
        item.addEventListener('click', () => startQuiz(memberName));
        
        memberListEl.appendChild(item);
    });
}

// 2. クイズ開始初期化
function startQuiz(memberName) {
    currentMemberName = memberName;
    currentQuizList = allMemberQuizData[memberName];
    
    if(!currentQuizList || currentQuizList.length === 0) {
        alert("準備中です"); return;
    }

    currentQuizIndex = 0;
    userAnswers = []; // 回答リセット
    document.getElementById('targetMemberName').textContent = memberName;
    
    loadQuestion();
    showScreen(screenQuiz);
}

// 問題表示
function loadQuestion() {
    const data = currentQuizList[currentQuizIndex];
    document.getElementById('quizNumber').textContent = currentQuizIndex + 1;
    document.getElementById('quizText').textContent = data.q;
    
    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = "";
    selectedOption = null; // 選択リセット
    btnQuizNext.disabled = true; // ボタン無効化

    // 最終問題ならボタンの文字を変える
    if (currentQuizIndex === currentQuizList.length - 1) {
        btnQuizNext.textContent = "結果を見る (FINISH)";
    } else {
        btnQuizNext.textContent = "決定 (NEXT)";
    }

    // 選択肢ボタン生成
    data.options.forEach(opt => {
        const btn = document.createElement('div');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        
        // クリック時の処理（選択状態にするだけ）
        btn.addEventListener('click', () => selectOption(opt, btn));
        
        optionsEl.appendChild(btn);
    });
}

// 選択肢を選んだ時の処理
function selectOption(optionText, btnElement) {
    selectedOption = optionText;
    
    // 見た目の更新（全てのボタンからselectedを消して、押したものだけに付ける）
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    
    // 決定ボタンを有効化
    btnQuizNext.disabled = false;
}

// 決定ボタンを押した時の処理
btnQuizNext.addEventListener('click', () => {
    if (!selectedOption) return;

    // 回答を記録
    userAnswers.push(selectedOption);

    // 次へ進む or 終了
    currentQuizIndex++;
    if (currentQuizIndex < currentQuizList.length) {
        loadQuestion();
    } else {
        finishGame(); // 採点へ
    }
});

// 3. 採点・結果発表
async function finishGame() {
    let score = 0;
    
    // 答え合わせ
    currentQuizList.forEach((quiz, index) => {
        if (quiz.answer === userAnswers[index]) {
            score++;
        }
    });

    const maxScore = currentQuizList.length;

    // データベースに保存する
    const { error } = await sb
        .from('game_results')
        .insert([
            { 
                player_name: playerName,          // プレイヤー名
                target_member: currentMemberName, // 誰のクイズか
                score: score                      // 得点 (0〜8)
            }
        ]);
        
    if(error) console.error('保存エラー:', error);


    //満点か、それ以外か
    if (score === maxScore) {
        // --- 全問正解（スペシャル画面） ---

        document.getElementById('resultMemberName').textContent = currentMemberName;
        document.getElementById('winnerNameDisplay').textContent = playerName;
        showScreen(screenResultSpecial);

    } else {
        // --- 通常結果（ノーマル画面） ---
        document.getElementById('resultScore').textContent = `${score} / ${maxScore}`;
        
        const msgEl = document.getElementById('resultMsg');
        if (score >= maxScore - 1) {
            msgEl.textContent = "惜しい！あと一歩！";
        } else if (score >= maxScore / 2) {
            msgEl.textContent = "その調子！";
        } else {
            msgEl.textContent = "出直してこい！";
        }
        showScreen(screenResultNormal);
    }
}

// リトライ
document.getElementById('btnBackToStart').addEventListener('click', () => showScreen(screenStart));
document.getElementById('btnGameRetry').addEventListener('click', () => showScreen(screenStart));
document.getElementById('btnGameRetrySpecial').addEventListener('click', () => showScreen(screenStart));

/* script.js の一番下に追加 */

// =========================================
// 6. スプラッシュ画面制御
// =========================================
window.addEventListener('load', () => {
    const splash = document.getElementById('splashScreen');
    
    if (splash) {
        // 1.5秒後にフェードアウト開始
        setTimeout(() => {
            splash.classList.add('fade-out');
        }, 1500); // 1500ミリ秒 = 1.5秒 (好きな長さに調整可)
    }
});

/* script.js の一番下に追加 */

// =========================================
// 7. NEWS機能 (トップ3件 + モーダル全件)
// =========================================

// ★ニュースデータはここで管理！(新しい順に書いてください)
const newsData = [
    {
        date: "2026.02.03",
        label: "APP",
        labelColor: "label-red",
        title: "このサイトをアプリとして保存する方法",
        link: "#",
        specialId: "openAppModal" // ★アプリ保存のモーダルを開くための目印
    },
    {
        date: "2026.02.01",
        label: "INFO",
        labelColor: "label-red",
        title: "第1弾出演バンド発表！ZERO GRADUATION LIVE 2026 始動",
        link: "#timetable"
    },
    {
        date: "2026.01.31",
        label: "INFO",
        labelColor: "label-red",
        title: "ZERO卒業ライブ　オリジナルグッズ発売！",
        link: "#goods"
    },
    {
        date: "2026.01.20",
        label: "TICKET",
        labelColor: "label-blue",
        title: "チケットオフィシャル先行抽選 受付スタート！",
        link: "#ticket"
    }
    // ★新しいニュースはここに追加してください
];

// 要素取得
const newsListEl = document.getElementById('newsList');
const newsAllListEl = document.getElementById('newsAllList');
const openNewsModalBtn = document.getElementById('openNewsModal');
const newsModal = document.getElementById('newsModal');
const closeNewsModalBtn = document.getElementById('closeNewsModal');

// モーダル開閉
if (openNewsModalBtn) {
    openNewsModalBtn.addEventListener('click', (e) => {
        e.preventDefault(); // リンクの動きを止める
        newsModal.classList.add('active');
    });
    closeNewsModalBtn.addEventListener('click', () => newsModal.classList.remove('active'));
    newsModal.addEventListener('click', (e) => {
        if(e.target === newsModal) newsModal.classList.remove('active');
    });
}

// ニュース表示関数
function renderNews() {
    // 1. トップページ用 (最新3件)
    const top3 = newsData.slice(0, 3);
    newsListEl.innerHTML = "";
    top3.forEach(news => {
        const item = createNewsItem(news);
        newsListEl.appendChild(item);
    });

    // 2. モーダル用 (全件)
    newsAllListEl.innerHTML = "";
    newsData.forEach(news => {
        const item = createNewsItem(news);
        newsAllListEl.appendChild(item);
    });
}

// ニュースのHTMLを作る関数
function createNewsItem(news) {
    const a = document.createElement('a');
    a.href = news.link;
    a.classList.add('news-item');
    
    // アプリ保存の説明モーダルを開く特別な処理
    if (news.specialId === "openAppModal") {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            // ニュースモーダルが開いていたら閉じて、アプリモーダルを開く
            newsModal.classList.remove('active'); 
            document.getElementById('appModal').classList.add('active');
        });
    } else if (news.link.startsWith('#')) {
        // ページ内リンクの場合、モーダルを閉じてから移動
        a.addEventListener('click', () => {
            newsModal.classList.remove('active');
        });
    }

    a.innerHTML = `
        <div class="news-meta">
            <span class="news-date">${news.date}</span>
            <span class="news-label ${news.labelColor}">${news.label}</span>
        </div>
        <p class="news-title">${news.title}</p>
        <div class="news-arrow">→</div>
    `;
    return a;
}

// 実行
renderNews();

// =========================================
// 8. アプリモーダルの閉じる処理
// =========================================
const appModalEl = document.getElementById('appModal');
const closeAppModalBtnEl = document.getElementById('closeAppModal');

if (appModalEl && closeAppModalBtnEl) {
    // CLOSEボタンで閉じる
    closeAppModalBtnEl.addEventListener('click', () => {
        appModalEl.classList.remove('active');
    });
    
    // 背景クリックでも閉じる
    appModalEl.addEventListener('click', (e) => {
        if (e.target === appModalEl) {
            appModalEl.classList.remove('active');
        }
    });
}