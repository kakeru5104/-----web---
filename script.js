
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
// 4. 掲示板機能
// =========================================


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

// 送信GASバックエンド経由

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyBVJDpelnk378eVJdVtdrTNBA5VAWlEtlwqxSV5_GRwRSAKOj__uGAMDuMWYwCoAXCGQ/exec';

bbsSendBtn.addEventListener('click', async () => {
    const name = bbsNameInput.value.trim();
    const content = bbsContentInput.value.trim();

    if (!content) {
        alert('メッセージを入力してください');
        return;
    }

    // 送信中はボタンを押せないようにする
    bbsSendBtn.disabled = true;
    bbsSendBtn.textContent = 'SENDING...';

    try {
        // GAS（Googleサーバー）へデータを送信
        const response = await fetch(GAS_URL, {
            method: 'POST',
            // POSTする時は text/plain にしてCORSエラーを回避します
            headers: { 'Content-Type': 'text/plain' }, 
            body: JSON.stringify({ name: name, content: content })
        });

        // GASからの返事を受け取る
        const result = await response.json();

        if (result.error) {
            // サーバー側でNGワードに引っかかった場合など
            alert(result.error);
        } else {
            // 成功した場合
            bbsNameInput.value = '';
            bbsContentInput.value = '';
            fetchBbs(); // 掲示板を再読み込み
            alert('メッセージを送信しました！');
        }
    } catch (error) {
        console.error('通信エラー:', error);
        alert('通信に失敗しました。');
    } finally {
        // ボタンを元の状態に戻す
        bbsSendBtn.disabled = false;
        bbsSendBtn.textContent = 'SEND MESSAGE';
    }
});

// 初回読み込み
fetchBbs();


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
// 5. GAME機能 (セキュア・サーバー採点完全版)
// =========================================

const GAME_GAS_URL = 'https://script.google.com/macros/s/AKfycby-46vg8QCOZ7cvpRpZDZVXZPKZAWZISOXEesPkH7F60ALxYASb3ErOlkUF3PSVHux_Qg/exec';

const GAME_RELEASE_DATE = new Date("2026-03-15T18:00:00"); 

const memberNames = [
    "松岡みさと",
    "阪本 陸",
    "五味駿介",
    "植田匠",
    "白井皐矢",
    "竹内駿瑠",
    "森夏海",
    "吉野覚旨",
    "吉村由宇",
    "菅原奈央",
    "新井大貴",
    "梶山 侑里",
    "吉川魁星",
    "寺戸一真",
    "橋本彩乃",
    "的場正",
    "永岡俊祐"
];

// 変数
let currentMemberName = "";
let currentQuizList = [];
let currentQuizIndex = 0;
let userAnswers = []; 
let playerName = "";
let selectedOption = null; 

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

// 1. スタート
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
    memberNames.forEach(memberName => { 
        const item = document.createElement('div');
        item.classList.add('member-list-item');
        item.textContent = memberName;
        item.addEventListener('click', () => startQuiz(memberName));
        memberListEl.appendChild(item);
    });
}

// 2. 初期化
async function startQuiz(memberName) {
    currentMemberName = memberName;
    userAnswers = []; // 回答リセット
    document.getElementById('targetMemberName').textContent = memberName;
    
    // ロード中の表示
    document.getElementById('quizText').textContent = "問題を読み込み中...";
    document.getElementById('quizOptions').innerHTML = "";
    btnQuizNext.disabled = true;
    showScreen(screenQuiz);

    try {
        const response = await fetch(GAME_GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: "get_questions", member: memberName })
        });
        
        const result = await response.json();

        if (result.error) {
            alert(result.error);
            showScreen(screenStart);
            return;
        }

        // 答えが入っていない安全な問題リストを受け取る
        currentQuizList = result.quizData;
        currentQuizIndex = 0;
        loadQuestion();

    } catch (error) {
        console.error("通信エラー", error);
        alert("問題の取得に失敗しました。");
        showScreen(screenStart);
    }
}

function loadQuestion() {
    const data = currentQuizList[currentQuizIndex];
    document.getElementById('quizNumber').textContent = currentQuizIndex + 1;
    document.getElementById('quizText').textContent = data.q;
    
    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = "";
    selectedOption = null; 
    btnQuizNext.disabled = true; 

    if (currentQuizIndex === currentQuizList.length - 1) {
        btnQuizNext.textContent = "結果を見る (FINISH)";
    } else {
        btnQuizNext.textContent = "決定 (NEXT)";
    }

    data.options.forEach(opt => {
        const btn = document.createElement('div');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        
        btn.addEventListener('click', () => selectOption(opt, btn));
        optionsEl.appendChild(btn);
    });
}

function selectOption(optionText, btnElement) {
    selectedOption = optionText;
    
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    
    btnQuizNext.disabled = false;
}

btnQuizNext.addEventListener('click', () => {
    if (!selectedOption) return;

    userAnswers.push(selectedOption);

    currentQuizIndex++;
    if (currentQuizIndex < currentQuizList.length) {
        loadQuestion();
    } else {
        finishGame(); 
    }
});

// -----------------------------------------
// 3. 採点・結果発表
// -----------------------------------------
async function finishGame() {
    document.getElementById('quizText').textContent = "採点中...";
    document.getElementById('quizOptions').innerHTML = "";
    btnQuizNext.style.display = 'none';

    try {
        const response = await fetch(GAME_GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ 
                action: "submit_answers", 
                member: currentMemberName,
                answers: userAnswers // ユーザーが選んだ回答リストを送る
            })
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            showScreen(screenStart);
            return;
        }

        const score = result.score;
        const maxScore = result.maxScore;

        const { error } = await sb
            .from('game_results')
            .insert([
                { 
                    player_name: playerName,
                    target_member: currentMemberName,
                    score: score
                }
            ]);
            
        if(error) console.error('保存エラー:', error);

        btnQuizNext.style.display = 'block';

        if (score === maxScore) {
            document.getElementById('resultMemberName').textContent = currentMemberName;
            document.getElementById('winnerNameDisplay').textContent = playerName;
            showScreen(screenResultSpecial);
        } else {
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

    } catch (error) {
        console.error("採点エラー", error);
        alert("採点に失敗しました。");
        showScreen(screenStart);
        btnQuizNext.style.display = 'block';
    }
}

// リトライ
document.getElementById('btnBackToStart').addEventListener('click', () => showScreen(screenStart));
document.getElementById('btnGameRetry').addEventListener('click', () => showScreen(screenStart));
document.getElementById('btnGameRetrySpecial').addEventListener('click', () => showScreen(screenStart));

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
// 7. NEWS機能 
// =========================================



const newsData = [
    //         {
    //     date: "2026.02.18",
    //     label: "INFO",
    //     labelColor: "label-red",
    //     title: "タイムテーブル発表！全出演バンド・タイムテーブル公開！",
    //     link: "#timetable"
    // },

            {
        date: "2026.02.08",
        label: "INFO",
        labelColor: "label-red",
        title: "多数のご要望によりグッズ化実現！ラバーバンド受注生産開始！詳しくはグッズへ",
        link: "#goods"
    },
            {
        date: "2026.02.08",
        label: "INFO",
        labelColor: "label-red",
        title: "第3弾出演バンド発表！全出演バンド発表！",
        link: "#timetable"
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
        specialId: "openAppModal" 
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
// 9. ラバーバンド予約機能
// =========================================

const RESERVE_DEADLINE = new Date("2026-03-13T17:00:00");

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


if (resForm) {
    resForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (localStorage.getItem('goods_reserved')) {
            alert("すでに予約済みです。");
            return;
        }

        const name = document.getElementById('resName').value;
        const contact = document.getElementById('resContact').value;

        const qtyW = parseInt(resQtyWhite.value);
        const qtyM = parseInt(resQtyMarble.value);
        const totalQty = qtyW + qtyM;
        const totalPrice = totalQty * 500;


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

// =========================================
// 10. 詳細画面から予約画面への移動
// =========================================


window.moveToReserve = function() {
    console.log("予約画面へ移動します"); 


    const goodsModal = document.getElementById('goodsModal');
    goodsModal.classList.remove('active');


    setTimeout(() => {
        const reserveBtn = document.getElementById('openReserveModal');
        if (reserveBtn) {
            reserveBtn.click();
        } else {
            console.error("予約ボタンが見つかりません");
        }
    }, 300);
};

// =========================================
// 11. タイムテーブルのタブ切り替え
// =========================================

const ttTabs = document.querySelectorAll('.tt-tab');
const ttContents = document.querySelectorAll('.tt-content');

ttTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 1. すべてのタブから active を外す
        ttTabs.forEach(t => t.classList.remove('active'));
        // 2. クリックされたタブに active をつける
        tab.classList.add('active');

        // 3. 表示するIDを取得 (例: "day1")
        const targetId = tab.getAttribute('data-target');

        // 4. すべてのコンテンツを隠す
        ttContents.forEach(content => {
            content.classList.remove('active');
        });

        // 5. 対象のコンテンツだけ表示する
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// =========================================
// 12. リアルタイム現在地バー
// =========================================

function updateCurrentTimeLine() {
    const line = document.getElementById('currentTimeLine');
    if (!line) return;

    const now = new Date();
    

    const IS_TEST_MODE = false; 


    const schedules = {
        "day1": { month: 2, date: 14 }, // 3/14
        "day2": { month: 2, date: 15 }, // 3/15
        "day3": { month: 2, date: 20 }, // 3/20
        "day4": { month: 2, date: 21 }  // 3/21
    };


    const activeTab = document.querySelector('.tt-tab.active');
    if (!activeTab) return;
    const targetId = activeTab.getAttribute('data-target');
    const targetDate = schedules[targetId];


    const isToday = IS_TEST_MODE || (
        now.getMonth() === targetDate.month && 
        now.getDate() === targetDate.date
    );

    if (!isToday) {
        line.style.display = 'none';
        return;
    }


    const hours = now.getHours();
    const minutes = now.getMinutes();


    const START_HOUR = 13;
    const PX_PER_HOUR = 60;

    if (hours < START_HOUR || hours >= 22) {

        line.style.display = 'none';
    } else {

        const topPosition = (hours - START_HOUR) * PX_PER_HOUR + minutes;
        
        line.style.display = 'block';
        line.style.top = `${topPosition}px`;
    }
}

// 1分ごとに更新
setInterval(updateCurrentTimeLine, 60000);

// 画面を開いた時や、タブを切り替えた時にも即実行
updateCurrentTimeLine();
const tabsForLine = document.querySelectorAll('.tt-tab');
tabsForLine.forEach(tab => {
    tab.addEventListener('click', () => {
        // タブ切り替えのアニメーションが終わった頃に再計算
        setTimeout(updateCurrentTimeLine, 100);
    });
});