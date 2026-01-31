/* script.js (完全版) */

// =========================================
// 1. ハンバーガーメニューの動作
// =========================================
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// 開く
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
}

// 閉じる
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
}

// リンクをクリックしたら閉じる
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});


// =========================================
// 2. スクロールアニメーションの制御
// =========================================

// 監視する要素（.fade-upがついている要素）をすべて取得
const fadeElements = document.querySelectorAll('.fade-up');

// 交差監視API（Intersection Observer）の設定
const observerOptions = {
    root: null,        // ビューポートを基準にする
    rootMargin: '0px', // 余白なし
    threshold: 0.2     // 要素が20%見えたら発火
};

// 監視の実行内容
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // 画面内に入ったら
        if (entry.isIntersecting) {
            // .show クラスをつけてアニメーション開始
            entry.target.classList.add('show');
            // 一度表示したら監視をやめる（負荷軽減）
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 各要素に監視を設定
fadeElements.forEach(element => {
    observer.observe(element);
});


// =========================================
// 3. TICKET抽選機能（ここが動いていない箇所）
// =========================================
const lotteryBtn = document.getElementById('lotteryBtn');
const winModal = document.getElementById('winModal');
const closeModalBtn = document.getElementById('closeModal'); // 名前重複を防ぐため変更

// ボタンが存在するかチェックしてから実行
if (lotteryBtn && winModal && closeModalBtn) {
    
    // ボタンクリックで当選画面を表示
    lotteryBtn.addEventListener('click', () => {
    
    // 1. ボタンの文字を「抽選中...」に変える（演出）
    const originalHTML = lotteryBtn.innerHTML; // 元の文字（APPLY NOW）を覚えておく
    lotteryBtn.innerHTML = 'JUDGING...<span class="small">抽選中...</span>';
    lotteryBtn.style.opacity = '0.8'; // 少し薄くする
    lotteryBtn.style.pointerEvents = 'none'; // 連打できないようにする

    // 2. 時間差を作る（今回は3000ミリ秒＝3秒待ちます）
    setTimeout(() => {
        // === 3秒後に実行される内容 ===
        
        // 当選画面を表示
        winModal.classList.add('active');
        
        // ボタンを元の「APPLY NOW」に戻す
        lotteryBtn.innerHTML = originalHTML;
        lotteryBtn.style.opacity = '1';
        lotteryBtn.style.pointerEvents = 'auto';
        
    }, 3000); // ← ここで待ち時間を変更できます（2000=2秒, 3000=3秒）
});

    // CLOSEボタンで閉じる
    closeModalBtn.addEventListener('click', () => {
        winModal.classList.remove('active');
    });

    // 画面外（黒い部分）をクリックしても閉じれるようにする
    winModal.addEventListener('click', (e) => {
        if (e.target === winModal) {
            winModal.classList.remove('active');
        }
    });
} else {
    console.error("エラー: TICKET用のIDが見つかりません。HTMLのIDを確認してください。");
}