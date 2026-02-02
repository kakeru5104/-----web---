
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