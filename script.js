
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

if (ticketBtn) {
    ticketBtn.addEventListener('click', () => {
        // ボタンの見た目変更
        const defaultText = ticketBtn.innerHTML;
        ticketBtn.innerHTML = 'JUDGING...<span class="small">抽選中...</span>';
        ticketBtn.style.opacity = '0.8';
        ticketBtn.style.pointerEvents = 'none';

        // 3秒後に結果表示
        setTimeout(() => {
            if (modal) modal.classList.add('active');
            
            // ボタンを元に戻す
            ticketBtn.innerHTML = defaultText;
            ticketBtn.style.opacity = '1';
            ticketBtn.style.pointerEvents = 'auto';
        }, 3000);
    });
}

// モーダル閉じる（存在するときだけ）
if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// === グッズ詳細ポップアップ機能 ===
const goodsItems = document.querySelectorAll('.goods-item');
const goodsModal = document.getElementById('goodsModal');
const closeGoodsModal = document.getElementById('closeGoodsModal');

// モーダル内の要素
const modalImg = document.getElementById('modalGoodsImg');
const modalThumbnails = document.getElementById('modalGoodsThumbnails'); // ★追加：サムネイル枠
const modalName = document.getElementById('modalGoodsName');
const modalVar = document.getElementById('modalGoodsVar');
const modalPrice = document.getElementById('modalGoodsPrice');
const modalDesc = document.getElementById('modalGoodsDesc');

// 各グッズをクリックした時の動作
goodsItems.forEach(item => {
    item.addEventListener('click', () => {
        // クリックされたアイテムの中身を取得
        const mainImgSrc = item.querySelector('.goods-img').src;
        const name = item.querySelector('.goods-name').innerHTML;
        const variant = item.querySelector('.goods-var').textContent;
        const price = item.querySelector('.goods-price').textContent;
        const desc = item.querySelector('.goods-desc-source').innerHTML;

        //複数画像の取得処理
        const imagesSource = item.querySelector('.goods-images-source');
        let imgUrls = [mainImgSrc]; // デフォルトは表紙の1枚だけ

        if (imagesSource && imagesSource.textContent.trim() !== '') {
            // カンマ区切りの文字列を配列に変換する
            imgUrls = imagesSource.textContent.split(',').map(url => url.trim());
        }

        // モーダルにテキストをセット
        modalName.innerHTML = name;
        modalVar.textContent = variant;
        modalPrice.textContent = price;
        modalDesc.innerHTML = desc;

        // 画像とサムネイルのセット
        modalImg.src = imgUrls[0]; // メイン画像は配列の1番目
        modalThumbnails.innerHTML = ''; // 以前のサムネイルを消去

        // 画像が2枚以上ある場合のみサムネイルを生成する
        if (imgUrls.length > 1) {
            imgUrls.forEach((imgUrl, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgUrl;
                thumb.classList.add('modal-thumb');
                if (index === 0) thumb.classList.add('active'); // 1枚目を選択状態にする

                // サムネイルをクリックした時の処理（メイン画像の切り替え）
                thumb.addEventListener('click', () => {
                    modalImg.src = imgUrl; // メイン画像を切り替え
                    // 全サムネイルから active を外して、クリックしたものだけに付ける
                    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });

                modalThumbnails.appendChild(thumb);
            });
        }

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
// 5. GAME機能
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

    if (localStorage.getItem(`quiz_played_${memberName}`)) {
        alert(`${memberName} のクイズはすでに挑戦済みです`);
        return;
    }

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

    // データベース(Supabase)に得点を保存する
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

        localStorage.setItem(`quiz_played_${currentMemberName}`, 'true');
            
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
            {
        date: "2026.03.01",
        label: "INFO",
        labelColor: "label-red",
        title: "タイムテーブル発表！全出演バンド・タイムテーブル公開！",
        link: "#timetable"
    },

                {
        date: "2026.02.25",
        label: "GOODS",
        labelColor: "label-blue",
        title: "オリジナルTシャツグッズ化実現！受注生産開始！詳しくはグッズへ",
        link: "#goods"
    },

                {
        date: "2026.02.25",
        label: "INFO",
        labelColor: "label-red",
        title: "【重要】ラバーバンドの受け渡しは3.20以降となります",
        link: "#goods"
    },

            {
        date: "2026.02.08",
        label: "GOODS",
        labelColor: "label-label-blue",
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
        date: "2026.01.20",
        label: "TICKET",
        labelColor: "label-blue",
        title: "チケットオフィシャル先行抽選 受付スタート！",
        link: "#ticket"
    }

];

const newsListEl = document.getElementById('newsList');
const newsAllListEl = document.getElementById('newsAllList');
const openNewsModalBtn = document.getElementById('openNewsModal');
const newsModal = document.getElementById('newsModal');
const closeNewsModalBtn = document.getElementById('closeNewsModal');

if (openNewsModalBtn) {
    openNewsModalBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        newsModal.classList.add('active');
    });
    closeNewsModalBtn.addEventListener('click', () => newsModal.classList.remove('active'));
    newsModal.addEventListener('click', (e) => {
        if(e.target === newsModal) newsModal.classList.remove('active');
    });
}

function renderNews() {
    const top3 = newsData.slice(0, 3);
    newsListEl.innerHTML = "";
    top3.forEach(news => {
        const item = createNewsItem(news);
        newsListEl.appendChild(item);
    });

    newsAllListEl.innerHTML = "";
    newsData.forEach(news => {
        const item = createNewsItem(news);
        newsAllListEl.appendChild(item);
    });
}

function createNewsItem(news) {
    const a = document.createElement('a');
    a.href = news.link;
    a.classList.add('news-item');
    
    if (news.specialId === "openAppModal") {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            newsModal.classList.remove('active'); 
            document.getElementById('appModal').classList.add('active');
        });
    } else if (news.link.startsWith('#')) {
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

renderNews();

// =========================================
// 8. アプリモーダルの閉じる処理
// =========================================
const appModalEl = document.getElementById('appModal');
const closeAppModalBtnEl = document.getElementById('closeAppModal');

if (appModalEl && closeAppModalBtnEl) {
    closeAppModalBtnEl.addEventListener('click', () => {
        appModalEl.classList.remove('active');
    });
    
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

const openResBtn = document.getElementById('openReserveModal');
const resModal = document.getElementById('reserveModal');
const closeResBtn = document.getElementById('closeReserveModal');
const resForm = document.getElementById('reserveForm');
const viewForm = document.getElementById('reserveFormView');
const viewSuccess = document.getElementById('reserveSuccessView');

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
}

if (closeResBtn) {
    closeResBtn.addEventListener('click', () => {
        resModal.classList.remove('active');
    });
}

if (resModal) {
    resModal.addEventListener('click', (e) => {
        if (e.target === resModal) {
            resModal.classList.remove('active');
        }
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
    const goodsName = document.getElementById('modalGoodsName').textContent;

    setTimeout(() => {
        if (goodsName.includes('Tシャツ')) {
            const reserveTshirtBtn = document.getElementById('openReserveTshirtModal');
            if (reserveTshirtBtn) reserveTshirtBtn.click();
            
        } else if (goodsName.includes('ラバーバンド')) {
            const reserveRubberBtn = document.getElementById('openReserveModal');
            if (reserveRubberBtn) {
                reserveRubberBtn.click();
            } else {
                const resModal = document.getElementById('reserveModal');
                if (resModal) {
                    if (new Date() > new Date("2026-03-13T17:00:00")) {
                        alert("ラバーバンドの予約受付は終了しました");
                        return;
                    }
                    if (localStorage.getItem('goods_reserved') === 'true') {
                        alert("ラバーバンドはすでに予約済みです");
                        return;
                    }
                    resModal.classList.add('active');
                }
            }
        // ▼ 追加：パネルの分岐 ▼
        } else if (goodsName.includes('パネル') || goodsName.includes('テラドカズマ')) {
            const resPanelModal = document.getElementById('reservePanelModal');
            if (resPanelModal) {
                if (new Date() > new Date("2026-03-01T23:59:59")) { 
                    alert("等身大パネルの予約受付は終了しました");
                    return;
                }
                if (localStorage.getItem('panel_reserved') === 'true') {
                    alert("等身大パネルはすでに予約済みです");
                    return;
                }
                resPanelModal.classList.add('active');
            }
        } else {
            alert("この商品は現在予約を受け付けていません。");
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
        ttTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetId = tab.getAttribute('data-target');

        ttContents.forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// =========================================
// 12. リアルタイムバー
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


setInterval(updateCurrentTimeLine, 60000);


updateCurrentTimeLine();
const tabsForLine = document.querySelectorAll('.tt-tab');
tabsForLine.forEach(tab => {
    tab.addEventListener('click', () => {

        setTimeout(updateCurrentTimeLine, 100);
    });
});

let clickCount = 0;
let clickTimer = null;

const gameTitle = document.querySelector('#game .section-title');

if (gameTitle) {
    gameTitle.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount >= 5) {

            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('quiz_played_')) {
                    localStorage.removeItem(key);
                }
            });
            alert('リセット');
            clickCount = 0; 
        }

        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1500);
    });
}

// =========================================
// 9.5 Tシャツ予約機能
// =========================================

// Tシャツの予約締め切り
const TSHIRT_RESERVE_DEADLINE = new Date("2026-03-19T23:59:59");


const openResTshirtBtn = document.getElementById('openReserveTshirtModal');
const resTshirtModal = document.getElementById('reserveTshirtModal');
const closeResTshirtBtn = document.getElementById('closeReserveTshirtModal');
const resTshirtForm = document.getElementById('reserveTshirtForm');
const viewTshirtForm = document.getElementById('reserveTshirtFormView');
const viewTshirtSuccess = document.getElementById('reserveTshirtSuccessView');


const resQtyBlack = document.getElementById('resQtyBlack');
const resQtyWhiteTshirt = document.getElementById('resQtyWhiteTshirt');
const displayPriceTshirt = document.getElementById('displayPriceTshirt');



function checkTshirtReservationStatus() {
    const now = new Date();
    if (now > TSHIRT_RESERVE_DEADLINE) {
        disableTshirtReserveButton("受付は終了しました");
        return;
    }

    if (localStorage.getItem('tshirt_reserved') === 'true') {
        disableTshirtReserveButton("予約済みです");
        return;
    }
}

function disableTshirtReserveButton(msg) {
    if (openResTshirtBtn) {
        openResTshirtBtn.textContent = msg;
        openResTshirtBtn.classList.add('disabled');
        openResTshirtBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); alert(msg); };
    }
}
window.addEventListener('load', checkTshirtReservationStatus);



if (openResTshirtBtn) {
    openResTshirtBtn.addEventListener('click', () => {
        if (new Date() > TSHIRT_RESERVE_DEADLINE) return;
        if (localStorage.getItem('tshirt_reserved')) return;
        resTshirtModal.classList.add('active');
    });
    closeResTshirtBtn.addEventListener('click', () => resTshirtModal.classList.remove('active'));
    resTshirtModal.addEventListener('click', (e) => {
        if(e.target === resTshirtModal) resTshirtModal.classList.remove('active');
    });
}


function updateTshirtPrice() {
    const qtyB = parseInt(resQtyBlack.value);
    const qtyW = parseInt(resQtyWhiteTshirt.value);
    const totalQty = qtyB + qtyW;
    const price = totalQty * 4000;
    displayPriceTshirt.textContent = `¥${price.toLocaleString()}`;
}

if (resQtyBlack && resQtyWhiteTshirt) {
    resQtyBlack.addEventListener('change', updateTshirtPrice);
    resQtyWhiteTshirt.addEventListener('change', updateTshirtPrice);
}


if (resTshirtForm) {
    resTshirtForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (localStorage.getItem('tshirt_reserved')) {
            alert("すでに予約済みです。");
            return;
        }

        const name = document.getElementById('resTshirtName').value;
        const contact = document.getElementById('resTshirtContact').value;
        const sizeInfo = document.getElementById('resTshirtSize').value;

        const qtyB = parseInt(resQtyBlack.value);
        const qtyW = parseInt(resQtyWhiteTshirt.value);
        const totalQty = qtyB + qtyW;
        const totalPrice = totalQty * 4000;

        if (totalQty === 0) {
            alert("枚数を選択してください。");
            return;
        }
        if (totalQty > 3) {
            alert("予約できるのは お一人様 合計3枚 までです。\n現在の合計: " + totalQty + "枚");
            return;
        }
        if (!sizeInfo) {
            alert("希望サイズを入力してください。");
            return;
        }

        const submitBtn = resTshirtForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = "送信中...";

        const { error } = await sb
            .from('tshirt_orders') 
            .insert([
                { 
                    name: name,
                    contact_info: contact,
                    color_black: qtyB,
                    color_white: qtyW,
                    size_info: sizeInfo,
                    quantity: totalQty,
                    total_price: totalPrice
                }
            ]);

        if (error) {
            console.error('予約エラー:', error);
            alert("エラーが発生しました。");
            submitBtn.disabled = false;
            submitBtn.textContent = "予約を確定する";
        } else {

            localStorage.setItem('tshirt_reserved', 'true');
            
            let itemDetails = "";
            if (qtyB > 0) itemDetails += `BLACK x${qtyB}`;
            if (qtyB > 0 && qtyW > 0) itemDetails += ", ";
            if (qtyW > 0) itemDetails += `WHITE x${qtyW}`;
            itemDetails += `\n(サイズ: ${sizeInfo})`;

            showTshirtSuccessTicket(name, itemDetails, totalPrice);
            disableTshirtReserveButton("予約済みです");
        }
    });
}

function showTshirtSuccessTicket(name, itemDetails, total) {
    viewTshirtForm.style.display = 'none';
    viewTshirtSuccess.style.display = 'block';

    document.getElementById('ticketTshirtName').textContent = name;
    document.getElementById('ticketTshirtItem').innerText = itemDetails;
    document.getElementById('ticketTshirtPrice').textContent = `¥${total.toLocaleString()}`;
    
    alert("Tシャツの予約が完了しました！");
}

// =========================================
// サイズタブの切り替え処理
// =========================================
const sizeTabs = document.querySelectorAll('.size-tab');
const resTshirtSizeInput = document.getElementById('resTshirtSize');

if (sizeTabs.length > 0) {
    sizeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sizeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            resTshirtSizeInput.value = tab.getAttribute('data-size');
        });
    });
}

// =========================================
// 詳細画面から予約画面への移動
// =========================================
window.moveToReserve = function() {
    console.log("予約画面へ移動します"); 
    const goodsModal = document.getElementById('goodsModal');
    goodsModal.classList.remove('active');
    const goodsName = document.getElementById('modalGoodsName').textContent;

    setTimeout(() => {
        if (goodsName.includes('Tシャツ')) {
            const reserveTshirtBtn = document.getElementById('openReserveTshirtModal');
            if (reserveTshirtBtn) reserveTshirtBtn.click();
            
        } else if (goodsName.includes('ラバーバンド')) {
            const reserveRubberBtn = document.getElementById('openReserveModal');
            if (reserveRubberBtn) {
                reserveRubberBtn.click();
            } else {
                const resModal = document.getElementById('reserveModal');
                if (resModal) {
                    if (new Date() > new Date("2026-03-13T17:00:00")) {
                        alert("ラバーバンドの予約受付は終了しました");
                        return;
                    }
                    if (localStorage.getItem('goods_reserved') === 'true') {
                        alert("ラバーバンドはすでに予約済みです");
                        return;
                    }
                    resModal.classList.add('active');
                }
            }
        } else if (goodsName.includes('パネル') || goodsName.includes('テラドカズマ')) {
            const resPanelModal = document.getElementById('reservePanelModal');
            if (resPanelModal) {
                if (new Date() > new Date("2026-03-01T23:59:59")) { 
                    alert("等身大パネルの予約受付は終了しました");
                    return;
                }
                if (localStorage.getItem('panel_reserved') === 'true') {
                    alert("等身大パネルはすでに予約済みです");
                    return;
                }
                resPanelModal.classList.add('active');
            }
        } else {
            alert("この商品は現在予約を受け付けていません。");
        }
    }, 300);
};

// =========================================
// 等身大パネル専用スロットカウンター
// =========================================
async function fetchPanelReservations() {
    const display = document.getElementById('panelReserveCount');
    if (!display) return;
    
    let totalCount = 0;
    
    try {

        const { data: panelData } = await sb.from('panel_orders').select('quantity');
        if (panelData) panelData.forEach(row => totalCount += (row.quantity || 0));
        
        animateSlotMachine(totalCount);
    } catch (e) {
        console.error('集計エラー', e);
        display.innerHTML = '<p style="color:white; font-size:1.5rem; padding: 20px;">ERROR</p>';
    }
}

function animateSlotMachine(targetNumber) {
    const container = document.getElementById('panelReserveCount');
    if (!container) return;
    

    const targetStr = String(targetNumber).padStart(3, '0');
    const targetDigits = targetStr.split('');
    
    container.innerHTML = ''; 
    

    targetDigits.forEach((digit, index) => {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'slot-window';
        
        const stripDiv = document.createElement('div');
        stripDiv.className = 'slot-digit-container';
        
        let html = '';
        const spins = 2 + index; 
        for(let i=0; i<spins; i++) {
            for(let j=0; j<=9; j++) {
                html += `<div class="slot-num">${j}</div>`; 
            }
        }
        // テープの一番最後に、本当の数字を置く
        html += `<div class="slot-num">${digit}</div>`;
        stripDiv.innerHTML = html;
        
        windowDiv.appendChild(stripDiv);
        container.appendChild(windowDiv);
        
        // ほんの少し遅らせてからアニメーション（CSSのtransform）を発動
        setTimeout(() => {
            const totalItems = (spins * 10) + 1;
            const itemHeight = 90; // CSSの.slot-windowの高さと合わせる
            const finalY = -((totalItems - 1) * itemHeight);
            
            // テープを上に向かって引き上げる（スロットの回転）
            stripDiv.style.transform = `translateY(${finalY}px)`;
        }, 50); 
    });
}

// ロード時に実行
window.addEventListener('load', fetchPanelReservations);

// =========================================
// 等身大パネル予約機能
// =========================================
const resPanelModal = document.getElementById('reservePanelModal');
const closeResPanelBtn = document.getElementById('closeReservePanelModal');
const resPanelForm = document.getElementById('reservePanelForm');
const viewPanelForm = document.getElementById('reservePanelFormView');
const viewPanelSuccess = document.getElementById('reservePanelSuccessView');
const resQtyPanel = document.getElementById('resQtyPanel');
const displayPricePanel = document.getElementById('displayPricePanel');

// モーダル閉じる
if (closeResPanelBtn) {
    closeResPanelBtn.addEventListener('click', () => resPanelModal.classList.remove('active'));
}
if (resPanelModal) {
    resPanelModal.addEventListener('click', (e) => {
        if(e.target === resPanelModal) resPanelModal.classList.remove('active');
    });
}

// 金額更新
function updatePanelPrice() {
    const qty = parseInt(resQtyPanel.value);
    const price = qty * 15000;
    displayPricePanel.textContent = `¥${price.toLocaleString()}`;
}
if (resQtyPanel) resQtyPanel.addEventListener('change', updatePanelPrice);

// フォーム送信
if (resPanelForm) {
    resPanelForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (localStorage.getItem('panel_reserved')) {
            alert("すでに予約済みです。");
            return;
        }

        const name = document.getElementById('resPanelName').value;
        const contact = document.getElementById('resPanelContact').value;
        const qty = parseInt(resQtyPanel.value);
        const totalPrice = qty * 15000;

        if (qty === 0) {
            alert("個数を選択してください。");
            return;
        }

        const submitBtn = resPanelForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = "送信中...";

        const { error } = await sb.from('panel_orders').insert([
            { name: name, contact_info: contact, quantity: qty, total_price: totalPrice }
        ]);

        if (error) {
            console.error('予約エラー:', error);
            alert("エラーが発生しました。");
            submitBtn.disabled = false;
            submitBtn.textContent = "予約を確定する";
        } else {
            localStorage.setItem('panel_reserved', 'true');
            
            viewPanelForm.style.display = 'none';
            viewPanelSuccess.style.display = 'block';

            document.getElementById('ticketPanelName').textContent = name;
            document.getElementById('ticketPanelItem').innerText = `等身大パネル x${qty}`;
            document.getElementById('ticketPanelPrice').textContent = `¥${totalPrice.toLocaleString()}`;
            
            alert("等身大パネルの予約が完了しました！");
            
            fetchPanelReservations();
        }
    });
}

let goodsClickCount = 0;
let goodsClickTimer = null;

const goodsTitleBtn = document.querySelector('#goods .section-title');
if (goodsTitleBtn) {
    goodsTitleBtn.addEventListener('click', () => {
        goodsClickCount++;
        
        if (goodsClickCount >= 5) {
            localStorage.removeItem('tshirt_reserved');
            localStorage.removeItem('goods_reserved');
            localStorage.removeItem('panel_reserved'); // パネルもリセット
            alert("画面を再読み込みします。");
            goodsClickCount = 0; 
            location.reload(); 
        }

        clearTimeout(goodsClickTimer);
        goodsClickTimer = setTimeout(() => { goodsClickCount = 0; }, 1500);
    });
}