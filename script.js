
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
// 4. BBS機能
// =========================================

const bbsNameInput = document.getElementById('bbsName');
const bbsContentInput = document.getElementById('bbsContent');
const bbsSendBtn = document.getElementById('bbsSendBtn');
const bbsListEl = document.getElementById('bbsList'); // トップページ用
const bbsAllListEl = document.getElementById('bbsAllList'); // モーダル用


const ngWords = [
    "死ね", "殺す", "馬鹿", "アホ", "クズ", 
    "暴力", "犯罪", "差別", "エッチ","陰毛","いんもう","まんこ","ま○こ","ま〇こ","まんk","マソコ","まん個",
    "オメコ","ヴァギナ","クリトリス","ちんこ","ちんk","ちんちん","チンポ","ペニス","penis","きんたま","肉棒","勃起","ボッキ","精子","射精","ザーメン","●～","○～","〇～","セックス","SEX","S○X","S〇X","体位","淫乱","アナル","anus","おっぱい","oppai","おっぱお","巨乳","きょにゅう","きょにゅー","貧乳","ひんにゅう","ひんにゅー","谷間","たにま","何カップ","なにカップ","手ブラ","てブラ","パンツ","パンティ","パンt","ノーパン","乳首","ちくび","ビーチク","自慰","オナニ","オナ二","オナヌ","マスターベーション","しこって","しこしこ","脱げ","ぬげ","脱いで","ぬいで","脱ごう","ぬごう","喘いで","あえいで","クンニ","フェラ","まんぐり","パイズリ","風俗","ふうぞく","ふーぞく","ソープ","デリヘル","ヘルス","姦","包茎","ほうけい","童貞","どうてい","どうてー","どーてー","どーてい","性器","処女","やりまん","乱交","バイブ","ローター","パイパン","中出し","中田氏","スカトロ","糞","うんこ","パコパコ","ホモ","homo","ぱいぱい","ノーブラ","手コキ","手マン","潮吹","下乳","横乳","指マン","犯し",
    "きもい","きめえ","変態","馬鹿","ばーか","baka","fuck","f*ck","ファック","不細工","ぶさいく","ブス","気違い","かす",
    "基地外","ブタ","くたばれ","潰せ","bitch","ビッチ","死す","死な","死ぬ","しぬ","死ね","しね","氏ね","shine","下手","へた","下手くそ","へたくそ","下手糞","へたくそ","無能","むのう","無様","ぶざま","無様な","ぶざまな","無様に","ぶざまに","無様だ","ぶざまだ",
    "死の","死ん","ﾀﾋ","殺さ","殺し","殺す","ころす","殺せ","ころせ","殺そ","乞食","ばばあ","ばばぁ","BBA","くず","ザコ","ころし","コロシ","糞野郎","くそやろう","クソ野郎","カス野郎","かすやろう","カス野郎","カスヤロウ","痴漢","ちかん","痴女","ちじょ","援交","えんこう","援助交際","レイプ",
    "大麻","麻薬","覚せい剤","覚醒剤","コカイン","ヘロイン","レイプ","rapist","カス","死体","屍","シタイ","シカイ","屍体","遺体","い体","いたい","強姦","強制わいせつ","強制猥褻","強制性交","輪姦","リンカン","リン姦","売春","ばいしゅん","売春婦","売春婦","売女","性奴隷","せいどれい","セイドレイ",
    "(0|０)[0-9-０-９ー－]{9,}","創価","■■■■■","☆☆☆☆","★★★★","整形","からきますた","ௌ","e三","引退おめ"


];

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
    bbsListEl.innerHTML = '<p class="loading-msg">Loading...</p>';
    if(bbsAllListEl) bbsAllListEl.innerHTML = '';

    const { data, error } = await sb
        .from('comments') 
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        bbsListEl.innerHTML = '<p>Error loading comments.</p>';
        return;
    }

    bbsListEl.innerHTML = ''; 

    // トップ3件
    const top3 = data.slice(0, 3); 
    top3.forEach(comment => {
        const item = createBbsElement(comment);
        bbsListEl.appendChild(item);
    });

    // モーダル全件
    if (bbsAllListEl) {
        data.forEach(comment => {
            const item = createBbsElement(comment);
            bbsAllListEl.appendChild(item);
        });
    }
}

// 吹き出し要素生成
function createBbsElement(comment) {
    const div = document.createElement('div');
    div.classList.add('bbs-item'); 

    const dateObj = new Date(comment.created_at);
    const dateStr = `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
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

// HTMLエスケープ
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// ★NGワードが含まれているかチェックする関数
function containsNgWord(text) {
    // 空っぽならセーフ
    if (!text) return false;
    
    // NGワードリストをひとつずつチェック
    for (const word of ngWords) {
        if (text.includes(word)) {
            return true; // 含まれていた！
        }
    }
    return false; // セーフ
}

// 送信ボタンクリック
bbsSendBtn.addEventListener('click', async () => {
    const name = bbsNameInput.value.trim();
    const content = bbsContentInput.value.trim();

    if (!content) {
        alert('メッセージを入力してください');
        return;
    }

    // ★ここでNGワードチェックを実行！
    if (containsNgWord(name) || containsNgWord(content)) {
        alert("不適切な言葉が含まれているため、送信できません。");
        return; // ここで処理を中断して、データベースには送らせない
    }

    // 問題なければ送信処理へ
    const { error } = await sb
        .from('comments')
        .insert([{ name: name || '名無し', content: content }]);

    if (error) {
        console.error('Add Error:', error);
        alert('送信に失敗しました');
    } else {
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
const GAME_RELEASE_DATE = new Date("2026-01-21T18:00:00"); 

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

// =========================================
// 7. NEWS機能 (トップ3件 + モーダル全件)
// =========================================

const newsData = [
            {
        date: "2026.02.08",
        label: "INFO",
        labelColor: "label-red",
        title: "ラバーバンド受注生産開始！詳しくはグッズへ",
        link: "#goods"
    },
        {
        date: "2026.02.04",
        label: "INFO",
        labelColor: "label-red",
        title: "第2弾出演バンド発表！新たに5バンド追加！",
        link: "#timetable"
    },
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

// =========================================
// 9. ラバーバンド予約機能 (DB構造最適化版)
// =========================================

const RESERVE_DEADLINE = new Date("2026-02-13T16:00:00");

// 要素の取得
const openResBtn = document.getElementById('openReserveModal');
const resModal = document.getElementById('reserveModal');
const closeResBtn = document.getElementById('closeReserveModal');
const resForm = document.getElementById('reserveForm');
const viewForm = document.getElementById('reserveFormView');
const viewSuccess = document.getElementById('reserveSuccessView');

// 色別のセレクトボックス
const resQtyWhite = document.getElementById('resQtyWhite');
const resQtyMarble = document.getElementById('resQtyMarble');
const displayPrice = document.getElementById('displayPrice');

// 1. 状態チェック
function checkReservationStatus() {
    const now = new Date();
    if (now > RESERVE_DEADLINE) {
        disableReserveButton("予約受付は終了しました");
        return;
    }
    if (localStorage.getItem('goods_reserved') === 'true') {
        disableReserveButton("予約済みです");
        return;
    }
}

function disableReserveButton(msg) {
    if (openResBtn) {
        openResBtn.textContent = msg;
        openResBtn.classList.add('disabled');
        openResBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); alert(msg); };
    }
}
window.addEventListener('load', checkReservationStatus);

// 2. モーダル開閉
if (openResBtn) {
    openResBtn.addEventListener('click', () => {
        if (new Date() > RESERVE_DEADLINE) return;
        if (localStorage.getItem('goods_reserved')) return;
        resModal.classList.add('active');
    });
    closeResBtn.addEventListener('click', () => resModal.classList.remove('active'));
    resModal.addEventListener('click', (e) => {
        if(e.target === resModal) resModal.classList.remove('active');
    });
}

// 3. 金額と個数の計算
function updatePrice() {
    const qtyW = parseInt(resQtyWhite.value);
    const qtyM = parseInt(resQtyMarble.value);
    const totalQty = qtyW + qtyM;
    const price = totalQty * 500;
    displayPrice.textContent = `¥${price.toLocaleString()}`;
}

if (resQtyWhite && resQtyMarble) {
    resQtyWhite.addEventListener('change', updatePrice);
    resQtyMarble.addEventListener('change', updatePrice);
}

// 4. 予約送信処理
if (resForm) {
    resForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (localStorage.getItem('goods_reserved')) {
            alert("すでに予約済みです。");
            return;
        }

        const name = document.getElementById('resName').value;
        const contact = document.getElementById('resContact').value;
        
        // 個数を取得
        const qtyW = parseInt(resQtyWhite.value);
        const qtyM = parseInt(resQtyMarble.value);
        const totalQty = qtyW + qtyM;
        const totalPrice = totalQty * 500;

        // チェック
        if (totalQty === 0) {
            alert("個数を選択してください。");
            return;
        }
        if (totalQty > 3) {
            alert("予約できるのは お一人様 合計3個 までです。\n現在の合計: " + totalQty + "個");
            return;
        }

        const submitBtn = resForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = "送信中...";

        // ★★★ ここを変更！それぞれの色を別のカラムに保存 ★★★
        const { error } = await sb
            .from('goods_orders')
            .insert([
                { 
                    name: name,
                    contact_info: contact,
                    color_white: qtyW,    // 白の個数 (数値)
                    color_marble: qtyM,   // マーブルの個数 (数値)
                    quantity: totalQty,   // 合計個数 (数値)
                    total_price: totalPrice
                }
            ]);

        if (error) {
            console.error('予約エラー:', error);
            alert("エラーが発生しました。");
            submitBtn.disabled = false;
            submitBtn.textContent = "予約を確定する";
        } else {
            localStorage.setItem('goods_reserved', 'true');
            
            // 完了画面用の文字作成（例：WHITE x1, MARBLE x2）
            let itemDetails = "";
            if (qtyW > 0) itemDetails += `WHITE x${qtyW}`;
            if (qtyW > 0 && qtyM > 0) itemDetails += ", ";
            if (qtyM > 0) itemDetails += `MARBLE x${qtyM}`;

            showSuccessTicket(name, itemDetails, totalPrice);
            disableReserveButton("予約済みです");
        }
    });
}

// 完了画面
function showSuccessTicket(name, itemDetails, total) {
    viewForm.style.display = 'none';
    viewSuccess.style.display = 'block';

    document.getElementById('ticketName').textContent = name;
    document.getElementById('ticketItem').textContent = itemDetails;
    document.getElementById('ticketPrice').textContent = `¥${total.toLocaleString()}`;
    
    alert("予約が完了しました！");
}