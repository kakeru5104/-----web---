
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

const nameInput = document.getElementById('bbsName');
const msgInput = document.getElementById('bbsContent');
const sendBtn = document.getElementById('bbsSendBtn');
const listArea = document.getElementById('bbsList');

// --- コメントを読み込む関数 ---
async function fetchComments() {
    // データベースからデータを取得（作成日時の新しい順）
    const { data, error } = await sb
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        listArea.innerHTML = '<p>コメントの読み込みに失敗しました</p>';
        return;
    }

    // HTMLに表示
    listArea.innerHTML = ''; // 一旦クリア
    data.forEach(comment => {
        const date = new Date(comment.created_at).toLocaleDateString();
        // XSS対策（簡単な無害化）
        const safeName = comment.name ? comment.name.replace(/</g, "&lt;") : '名無し';
        const safeMsg = comment.content.replace(/</g, "&lt;");

        const html = `
            <div class="bbs-item">
                <div class="bbs-meta">
                    <span class="bbs-name">${safeName}</span>
                    <span class="bbs-date">${date}</span>
                </div>
                <p class="bbs-text">${safeMsg}</p>
            </div>
        `;
        listArea.insertAdjacentHTML('beforeend', html);
    });
}

// --- コメントを送信する関数 ---
sendBtn.addEventListener('click', async () => {
    const name = nameInput.value || '名無し';
    const content = msgInput.value;

    if (!content) {
        alert('メッセージを入力してください');
        return;
    }

    // 送信中はボタンを押せないようにする
    sendBtn.disabled = true;
    sendBtn.textContent = 'SENDING...';

    // データベースに追加
    const { error } = await sb
        .from('comments')
        .insert([
            { name: name, content: content }
        ]);

    if (error) {
        console.error('Error:', error);
        alert('送信に失敗しました');
    } else {
        // 成功したらフォームを空にして再読み込み
        msgInput.value = '';
        fetchComments();
    }

    // ボタンを元に戻す
    sendBtn.disabled = false;
    sendBtn.textContent = 'SEND MESSAGE';
});

// ページを開いたらコメントを読み込む
fetchComments();

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
const GAME_RELEASE_DATE = new Date("2026-01-14T20:00:00"); 

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