
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