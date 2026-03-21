
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

const GAME_RELEASE_DATE = new Date("2026-03-15T16:45:00"); 

const memberNames = [
    "松岡みさと",
    "阪本 陸",
    "ごみしゅん",
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
    "永岡俊祐",
    "橋本彩乃",
    "的場正",
    "寺戸一真"
];

// ★ 問題集（オフライン動作用にJS内に直接保持）
const allMemberQuizData = {
    "新井大貴": [
        { q: "最後の晩餐には何を選ぶ？", options: ["焼肉", "餃子", "ご飯と味噌汁", "カレー"], answer: "餃子" },
        { q: "1番好きな寿司ネタは？", options: ["えんがわ", "ハンバーグ", "うに", "赤貝"], answer: "赤貝" },
        { q: "自分企画で1番印象に残っているバンドは？", options: ["Enfants", "キュウソネコカミ", "女王蜂", "チェンソーマンオムニバス"], answer: "女王蜂" },
        { q: "よく使う広島弁｢たいぎい｣ 正しい意味はどれ？", options: ["眠たい", "気まずい、居心地が悪い", "忙しい、時間がない", "めんどくさい、だるい"], answer: "めんどくさい、だるい" },
        { q: "1番好きなポケモンは？", options: ["シャンデラ", "ゲンガー", "ユキメノコ", "ムウマージ"], answer: "シャンデラ" },
        { q: "やったことあるバイトで正しいのはどれ？", options: ["レンタル彼氏", "治験", "CMのエキストラ", "キャバクラの黒服"], answer: "キャバクラの黒服" },
        { q: "1番吸っている煙草の銘柄は？", options: ["セブンスター", "ハイライト", "金ピース", "赤マル"], answer: "ハイライト" }
    ],
    "松岡みさと": [
        { q: "私がやったことない髪色はどれでしょう？", options: ["ピンク", "紫", "ホワイトブロンド", "グレー"], answer: "ホワイトブロンド" },
        { q: "私の家にない楽器は誰でしょう", options: ["クラリネット", "横笛", "サックス", "オーボエ"], answer: "クラリネット" },
        { q: "2025年の１年間で何杯ラーメンを食べたでしょう？", options: ["約150杯", "約100杯", "約50杯", "約200杯"], answer: "約150杯" },
        { q: "私が習ったことない習い事はどれでしょう", options: ["バレエ", "茶道", "そろばん", "体操"], answer: "そろばん" },
        { q: "大学生になってから行ったスタバの店舗数は何店舗でしょう", options: ["125店舗", "165店舗", "55店舗", "95店舗"], answer: "95店舗" },
        { q: "ライブ衣装で着たことがないコスプレはどれ？", options: ["浴衣", "制服", "着ぐるみ", "メイド服"], answer: "浴衣" },
        { q: "私が今までアルバイトしたことがないのはどれ？", options: ["郵便局", "居酒屋", "カフェ", "焼肉屋"], answer: "カフェ" }
    ],
    "阪本 陸": [
        { q: "わたしの出身はどこでしょう", options: ["東京", "兵庫", "京都", "大阪"], answer: "大阪" },
        { q: "好きな食べ物は何でしょう", options: ["鶏肉", "鮭", "納豆", "卵"], answer: "卵" },
        { q: "今年の1月に1番聞いたバンドは何でしょう(Apple music準拠)", options: ["civilian", "backnumber", "米津玄師", "THE ORAL CIGARETTES"], answer: "civilian" },
        { q: "苦手なのはどれでしょう", options: ["虫触ること", "人前で話すこと", "朝起きること", "人を待つこと"], answer: "人前で話すこと" },
        { q: "好きな動物は何でしょう", options: ["ハムスター", "猫", "犬", "うさぎ"], answer: "猫" },
        { q: "いつからベースを始めたでしょう", options: ["大学2回生", "高校1年生", "大学１回生", "中学3年生"], answer: "大学１回生" },
        { q: "今までに経験したアルバイトの数はいくつでしょう？", options: ["1個", "2個", "3個", "5個"], answer: "2個" }
    ],
    "白井皐矢": [
        { q: "私の出身地はどこでしょう？", options: ["京都府京都市伏見区葭島渡場島町32", "兵庫県宝塚市駒の町1-1", "奈良県奈良市北1丁目37-1", "奈良県奈良市あやめ池南6丁目6-43"], answer: "奈良県奈良市あやめ池南6丁目6-43" },
        { q: "私の「皐矢」という名前の由来はなんでしょう？", options: ["水際の病院で生まれたから(皐には水際という意味がある)", "5月生まれだから(旧暦5月の和風月名は皐月)", "競馬の「皐月賞」から", "皐魚の泣という故事成語から(親の死を嘆き悲しんで泣くたとえ)"], answer: "競馬の「皐月賞」から" },
        { q: "私がしたことのない習い事はなーんだっ！？", options: ["習字", "サッカー", "体操", "テニス"], answer: "サッカー" },
        { q: "私の1番好きなガンダム作品はなーんだって言ってんだ！？", options: ["機動戦士ガンダムSEED", "新機動戦記ガンダムW", "機動戦士ガンダム", "機動武闘伝Gガンダム"], answer: "機動武闘伝Gガンダム" },
        { q: "最近Twitchで配信している白井ですがゲーム発展国での自分の会社名はなーんだ", options: ["雷光堂", "SIRA", "LEVEL508", "KOYAMI"], answer: "雷光堂" },
        { q: "私の口癖ではないものはなんでしょう", options: ["ぷり〜", "うっひょ〜⤴︎", "それはちょっと…", "〜だって言ってんだって言ってんだ"], answer: "ぷり〜" },
        { q: "私の推しではないのは誰でしょーかっ！？", options: ["惣流・アスカ・ラングレー(エヴァンゲリオン)", "中野三玖(五等分の花嫁)", "ダイワスカーレット(ウマ娘)", "澤村・スペンサー・英梨々(冴えない彼女の育て方)"], answer: "中野三玖(五等分の花嫁)" }
    ],
    "梶山 侑里": [
        { q: "掛け持ち先のサークルはなんでしょう？", options: ["アカペラ", "違う軽音", "弓道", "吹奏楽"], answer: "アカペラ" },
        { q: "好きなお肉はなんでしょう？", options: ["豚肉", "鹿肉", "牛肉", "鶏肉"], answer: "牛肉" },
        { q: "私の学部はどこでしょう？", options: ["法学部", "社会学部", "社会安全学部", "文学部"], answer: "文学部" },
        { q: "好きな飲み物はなんでしょう？", options: ["センブリ茶", "スイカジュース", "紅茶", "コーヒー"], answer: "紅茶" },
        { q: "好きな色はなんでしょう", options: ["黄色", "ねずみ色", "黒色", "虹色"], answer: "黄色" },
        { q: "私の出身地はどこでしょう？", options: ["京都府", "滋賀県", "奈良県", "兵庫県"], answer: "兵庫県" },
        { q: "好きなお菓子はなんでしょう", options: ["ぱりんこ", "ぷっちょ", "いちごみるく飴", "カントリーマウム"], answer: "ぱりんこ" }
    ],
    "吉野覚旨": [
        { q: "僕のスタジオYOUの中で1番好きなスタジオはどこでしょう？", options: ["Fスタジオ", "Dスタジオ", "Cスタジオ", "Hスタジオ"], answer: "Dスタジオ" },
        { q: "スプレッドシートに書いてある好きな夜系バンドはどれでしょう？", options: ["YOASOBI", "月詠み", "ずっと真夜中でいいのに。", "三月のパンタシア"], answer: "月詠み" },
        { q: "今私が海外に行きたい国はどこでしょう？", options: ["ボスニア・ヘルツェゴビナ", "ドイツ", "スペイン", "クロアチア"], answer: "クロアチア" },
        { q: "Mrs. GREEN APPLEで初めて「ピアノカバー」をした曲は何か？", options: ["アウフヘーベン", "点描の唄", "愛情と矛先", "我逢人"], answer: "我逢人" },
        { q: "実は一度もコピーをした事がないバンドはどれか？", options: ["Mr.children", "RADWIMPS", "King Gnu", "back number"], answer: "RADWIMPS" },
        { q: "子供の頃にピアノの発表会で弾いたクラシックはどれか？", options: ["エリーゼのために", "子犬のワルツ", "アイネ・クライネ・ナハトムジーク", "トルコ行進曲"], answer: "アイネ・クライネ・ナハトムジーク" },
        { q: "ちなみに私の出身地はどこでしょう？(3歳まで居ました)", options: ["ネパール", "韓国", "中国", "台湾"], answer: "韓国" }
    ],
    "吉川魁星": [
        { q: "実は僕の右目の視力は1.0ある", options: ["盲目", "ない", "ある", "最近測ってないから分からない"], answer: "最近測ってないから分からない" },
        { q: "僕の身長は175センチあるでしょうか？", options: ["ある", "最近測ってないから分からない", "ない", "チビスケが"], answer: "最近測ってないから分からない" },
        { q: "小学生の時に卒業式で発表した将来の夢", options: ["滑り台", "サッカー選手", "政治家", "特に無し"], answer: "特に無し" },
        { q: "好きなジャンプの漫画は？", options: ["デスノート", "ボボボーボ・ボーボボ", "ワンピース", "ジョジョ"], answer: "デスノート" },
        { q: "太鼓の？", options: ["どちらでもない", "マイバチ所持者", "達人", "素人"], answer: "どちらでもない" },
        { q: "今の眼鏡は何代目でしょう？", options: ["分からない", "2代目", "5代目", "裸眼"], answer: "分からない" },
        { q: "僕のMBTIは？", options: ["PUBG", "ZARA", "ACDC", "SDGs"], answer: "SDGs" }
    ],
    "菅原奈央": [
        { q: "菅原が高校軽音楽部入部時、最初に志望していたパートはどれ？", options: ["キーボード", "ベース", "ドラム", "ギター"], answer: "ドラム" },
        { q: "菅原が生まれた場所はどこ？", options: ["兵庫県", "山梨県", "宮城県", "石川県"], answer: "山梨県" },
        { q: "菅原が中学の時入っていた部活は何？", options: ["吹奏楽部", "テニス部", "バレー部", "写真部"], answer: "テニス部" },
        { q: "この中で菅原が取得したことのない検定はどれ？", options: ["漢字検定2級", "色彩検定4級", "そろばん検定準1級", "けん玉検定5級"], answer: "色彩検定4級" },
        { q: "菅原の裸眼視力に最も近いのはどれ？ (学校の視力検査：Aは1.0以上、Bは0.9〜0.7、Cは0.6〜0.3、Dは0.3未満)", options: ["1.0", "0.01", "0.5", "0.1"], answer: "0.01" },
        { q: "菅原の苦手なものは？", options: ["コーヒー", "グレープフルーツ", "漬物", "かに味噌"], answer: "コーヒー" },
        { q: "菅原が現在使用しているキーボードの愛称は何？", options: ["クララ", "おんじ", "ハイジ", "ペーター"], answer: "おんじ" }
    ],
    "竹内駿瑠": [
        { q: "私の所属学科はどれでしょう？", options: ["電気電子情報工学科", "建築学科", "機械工学科", "環境都市工学科"], answer: "電気電子情報工学科" },
        { q: "私の使用ギターのメーカーはどこでしょう", options: ["Ibanez", "fender", "Bacchus", "PRS"], answer: "Ibanez" },
        { q: "私が最近欲しいものはどれでしょう？", options: ["単一指向性マイク", "ワイヤレス充電器", "一眼レフ", "Mac Book Pro"], answer: "一眼レフ" },
        { q: "私が人生で最初に購入したボードゲームはどれでしょう", options: ["人狼", "テストプレイなんてしてないよ", "人生ゲーム", "ナンジャモンジャ"], answer: "人狼" },
        { q: "私の子供の頃の将来の夢は？", options: ["フットボール選手", "サラリーマン", "絵本作家", "歌のおにいさん"], answer: "サラリーマン" },
        { q: "私が昔飼っていたペットはどれでしょう？", options: ["ハリネズミ", "ヤドカリ", "カマキリ", "チンチラ"], answer: "ヤドカリ" },
        { q: "私のスマブラの持ちキャラはどれでしょう", options: ["ピクミン&オリマー", "ロゼッタ&チコ", "ネス", "リドリー"], answer: "ネス" }
    ],
    "植田匠": [
        { q: "中学時代の部活はなんでしょう？", options: ["バレーボール", "卓球", "バドミントン", "ソフトテニス"], answer: "ソフトテニス" },
        { q: "初めてやったゲームはなんでしょう", options: ["妖怪ウォッチ", "スーパーマリオ3Dランド", "ドラゴンクエスト9", "ポケットモンスターブラック"], answer: "ポケットモンスターブラック" },
        { q: "1番好きなポケモンはなんでしょう？", options: ["ボーマンダ", "メタグロス", "バンギラス", "ボスゴドラ"], answer: "ボスゴドラ" },
        { q: "関大前で1番好きなお店はどこでしょう", options: ["きりん寺", "憲兵屋", "ディアブロ", "キラメキ"], answer: "きりん寺" },
        { q: "小学生の時の将来の夢はなんでしょう", options: ["パン屋さん", "警察官", "宇宙飛行士", "水族館のスタッフ"], answer: "宇宙飛行士" },
        { q: "1番最後にバイトしてたのはどこでしょう？", options: ["TOHOシネマズ", "Zoff", "ホテルのレストラン(クベール)", "ダイコクドラッグ"], answer: "TOHOシネマズ" },
        { q: "初めてライブハウスでライブを見たのはどのアーティストでしょう", options: ["MONGOL800", "THE ORAL CIGARETTES", "ヤバイTシャツ屋さん", "SUPER BEAVER"], answer: "MONGOL800" }
    ],
    "橋本彩乃": [
        { q: "飲みで1杯目に飲むお酒はどれでしょう", options: ["サワー", "ビール", "ハイボール", "梅酒"], answer: "ハイボール" },
        { q: "高校の時何のマネージャーをしていたでしょう", options: ["陸上", "野球", "バスケ", "バレー"], answer: "バスケ" },
        { q: "好きなチェーン店はどれでしょう", options: ["マクド", "サイゼ", "すき家", "くら寿司"], answer: "すき家" },
        { q: "小さい時の将来の夢はなんでしょう", options: ["ケロロ軍曹", "忍者", "人魚", "ケーキ屋さん"], answer: "忍者" },
        { q: "好きなアルファベットはなんでしょう", options: ["V", "O", "X", "Q"], answer: "Q" },
        { q: "男の子として生まれていた場合どの名前がつけられていたでしょう", options: ["たかひろ", "せいじ", "まなぶ", "よしひで"], answer: "よしひで" },
        { q: "好きな体の部位はどこでしょう", options: ["ひじ", "ひざ", "ふくらはぎ", "かかと"], answer: "かかと" }
    ],
    "永岡俊祐": [
        { q: "出身地はどこでしょう", options: ["岸和田市", "岸和田市", "泉佐野市", "和歌山市"], answer: "和歌山市" },
        { q: "誕生月は？", options: ["11月", "7月", "6月", "4月"], answer: "7月" },
        { q: "ギターを始めて最初にコピーした曲は？", options: ["20th century boy (T.Rex)", "ジョニーＢグッド(チャック・ベリー)", "Mステのテーマ(松本孝弘)", "marionette(BOØWY)"], answer: "marionette(BOØWY)" },
        { q: "中学２年でギターを始めたが、その理由は？", options: ["女の子にモテたかったから", "『けいおん！』にハマったから", "父に半強制で始めさせられたから", "中学の同級生がバンドを組んでいて影響されたから"], answer: "父に半強制で始めさせられたから" },
        { q: "1番面白いイケメンだと思うZEROの同期男子は？", options: ["こうや君", "ごみしゅん君", "あらい君", "かいせい君"], answer: "あらい君" },
        { q: "音楽が題材のアニメで1番好きなのは？", options: ["けいおん！", "ガールズバンドクライ", "BanG_Dream!(バンドリ)シリーズ", "響けユーフォニアム"], answer: "ガールズバンドクライ" },
        { q: "(激ムズ！)僕と出身高校が同じプロ野球選手(引退済みも含む)は誰？", options: ["中村紀洋(元近鉄など)", "筒香嘉智(DeNA)", "小久保裕紀(元ダイエー、巨人など)", "西川遥輝(日本ハム)"], answer: "小久保裕紀(元ダイエー、巨人など)" }
    ],
    "ごみしゅん": [
        { q: "僕の下の名前は何でしょう", options: ["駿介", "駿之介", "駿太", "駿"], answer: "駿介" },
        { q: "さっき僕の企画で演奏した最後の曲は何でしょう", options: ["bloom", "明日にだって", "ゆうな", "夕暮れ先生"], answer: "bloom" },
        { q: "ギターとベース、ライブでの出演回数はどちらが多いでしょう", options: ["ベース", "ギター", "どちらも弾いたことがない", "同じ"], answer: "同じ" },
        { q: "僕が持っている阪神のユニフォームは何という選手のユニフォームでしょう", options: ["佐藤（背番号8）", "森下（背番号1）", "近本（背番号5）", "大山（背番号3）"], answer: "佐藤（背番号8）" },
        { q: "居酒屋で最近こればっかり飲んでいるというお酒は何でしょう", options: ["ジンジャーハイ", "カルピスサワー", "ゆずサワー", "カシスオレンジ"], answer: "カルピスサワー" },
        { q: "気に入って使っているメインのエフェクターに描かれているイラスト", options: ["熊", "猫", "魚", "鳥"], answer: "魚" },
        { q: "ギター/ベースケースに【付けていない】キーホルダー", options: ["ウタマロせっけん", "七味", "キャラメルコーン", "チキンラーメン"], answer: "ウタマロせっけん" }
    ],
    "森夏海": [
        { q: "出身地(都道府県)は？", options: ["大阪", "兵庫", "滋賀", "京都"], answer: "大阪" },
        { q: "出身地(市)は？", options: ["大阪市", "寝屋川市", "交野市", "岸和田市"], answer: "寝屋川市" },
        { q: "ドラムを始めたのは？", options: ["小学校から", "高校から", "中学校から", "大学から"], answer: "中学校から" },
        { q: "好きな食べ物は？", options: ["辛いもの", "牡蠣", "お寿司", "お餅"], answer: "辛いもの" },
        { q: "高校の時に5段階評価で2を取っていた科目は？", options: ["美術", "物理", "数学", "倫理"], answer: "倫理" },
        { q: "好きなサンリオキャラは？", options: ["ポムポムプリン", "ハンギョドン", "ニャイニュエニョン", "こぎみゅん"], answer: "ポムポムプリン" },
        { q: "ドラムを始めたきっかけのバンドは？", options: ["ゲスの極み乙女。", "[Alexandros]", "フレデリック", "UNISON SQUARE GARDEN"], answer: "[Alexandros]" }
    ],
    "的場正": [
        { q: "僕の下の名前はなんでしょう", options: ["ただし", "ひろし", "たかとし", "たかし"], answer: "ただし" },
        { q: "僕の通学時間は？", options: ["45分", "30分", "15分", "1時間"], answer: "15分" },
        { q: "僕が1番最初に始めた楽器はなんでしょう", options: ["ベース", "ピアノ", "ガットギター", "アコースティックギター"], answer: "アコースティックギター" },
        { q: "僕が高校の頃に入っていた部活は？", options: ["ワンダーフォーゲル部", "軽音部", "生物部", "水泳部"], answer: "生物部" },
        { q: "僕の1番昔から推しているベーシストは誰でしょう？", options: ["やまもとひかる(Aooo)", "福田裕務(Suspended 4th)", "二家本亮介(ずっと真夜中でいいのに。)", "亀田誠治(東京事変)"], answer: "やまもとひかる(Aooo)" },
        { q: "僕の趣味ではないものはなんでしょう", options: ["スキー", "園芸", "釣り", "サイクリング"], answer: "スキー" },
        { q: "僕が1番好きな食べ物は？", options: ["牛タン", "家系ラーメン", "サバの味噌煮", "オムライス"], answer: "サバの味噌煮" }
    ],
    "寺戸一真": [
        { q: "私の出身地はどこでしょう？", options: ["奈良県生駒市小明町1314", "奈良県天理市嘉幡町600-1", "奈良県大和郡山市下三橋町741", "奈良県生駒郡安堵町8-14"], answer: "奈良県生駒郡安堵町8-14" },
        { q: "私が幼い頃やっていなかったことはなんでしょう？", options: ["捕まえた虫の中で1番泳げるのはどれだ選手権", "他人の家の桃を盗る", "隣家のたっくんと一緒に亀をいじめていた", "夏祭りに行けなかったので町中の蜘蛛の巣を集めてをわたあめを作る"], answer: "他人の家の桃を盗る" },
        { q: "私の大学の授業に遅刻した時の行動はどれ？", options: ["ムカつくので一旦USJで流れてるBGMを聞いて心を穏やかにする", "ムカつくので帰路にあるスーパーで堅あげポテトとコーラを買って帰る", "ムカつくのでマクドに行って約1時間遅刻していく", "ムカつくのでスケジュールから「授業」を消す"], answer: "ムカつくので帰路にあるスーパーで堅あげポテトとコーラを買って帰る" },
        { q: "私のアレルギーはどれでしょう？", options: ["かに🦀", "青色🟦", "えび🦐", "キーキーうるさいおじさん🦸‍♀️"], answer: "えび🦐" },
        { q: "私の1番好きな漫画のセリフはどれでしょう？", options: ["...君のような勘のいいガキは嫌いだよ", "ふふふ...まったく人をイライラさせるのがうまいやつらだ......", "俺は「納得」したいだけだ　「納得」は全てに優先するぜっ‼︎", "もうこれで終わってもいい　だからありったけを"], answer: "俺は「納得」したいだけだ　「納得」は全てに優先するぜっ‼︎" },
        { q: "私が1番好きなかけるんのモノマネはなんでしょう？", options: ["遊☆戯☆王デュエルモンスターズの海馬瀬人", "鬼滅の刃に出てくる鬼殺隊員に伝令を伝える鎹鴉", "呪術廻戦「陀艮戦」にて敵の領域展開から逃げるために共に戦う仲間へ向けた「集合」の号令", "新・豪血寺一族 -煩悩解放- レッツゴー！陰陽寺"], answer: "新・豪血寺一族 -煩悩解放- レッツゴー！陰陽寺" },
        { q: "もし生まれ変わるなら何？", options: ["ビスケット・オリバ", "五条悟", "トラファルガー・D・ワーテル・ロー", "轟焦凍"], answer: "五条悟" }
    ],
    "吉村由宇": [
        { q: "小中高10年間やってたスポーツは？", options: ["バスケ🏀", "野球⚾️", "サッカー⚽️", "バレー🏐"], answer: "野球⚾️" },
        { q: "１回生の時半年だけ掛け持ちしてたサークルは？", options: ["イベントサークル🎳", "テニスサークル🎾", "バドミントンサークル🏸", "別の軽音サークル🎸"], answer: "バドミントンサークル🏸" },
        { q: "1番好きな漫画はONEPIECEですが、その中で最も好きなのは何編でしょうか", options: ["エルバフ編🌴", "ドレスローザ編🦩", "ウルージの過去編🕰", "北の海編🌊"], answer: "ドレスローザ編🦩" },
        { q: "初めてライブに行ったアーティストは？", options: ["ONE OK ROCK🔥", "米津玄師🍋", "ヨルシカ🌙", "BUMP OF CHICKEN🔭"], answer: "ONE OK ROCK🔥" },
        { q: "大体なんでもOKと言いがちですが、この中で拒否する選択肢は？", options: ["ピノを6個中5個あげる", "一蘭を7杯たべる", "朝8時からバイトの前日飲み&カラオケオール", "ヨーロッパ7泊8日の次の日から別の旅行2泊3日"], answer: "一蘭を7杯たべる" },
        { q: "この中で経験したことがないことは？", options: ["富士山登頂", "四国１周", "九州１周", "バンジージャンプ"], answer: "バンジージャンプ" },
        { q: "あまり共感されないマック食べるときのこだわりは？", options: ["ナゲット15ピースは必ずマスタード3つにする", "サイドメニューをえだまめコーンにする", "ポテトを爆速で食いきってからバーガーを食べる", "アンケートで無料クーポンを必ずもらってから注文する"], answer: "ポテトを爆速で食いきってからバーガーを食べる" }
    ]
};

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

const gameLockedDiv = document.getElementById('gameLocked');
const gameUnlockedDiv = document.getElementById('gameUnlocked');

// if (gameLockedDiv) {
//     gameLockedDiv.addEventListener('click', () => {
//         // まだ公開時間前の場合だけパスワードを聞く
//         if (new Date() < GAME_RELEASE_DATE) {
//             const pass = prompt("【関係者テスト用】\nパスワードを入力してください：");
            
//             // パスワードが「zero2026」だったらロックを強制解除（好きなパスワードに変更してください）
//             if (pass === "zero2026") { 
//                 gameLockedDiv.style.display = 'none';
//                 gameUnlockedDiv.style.display = 'block';
//                 alert("ロックを解除しました！テストプレイを開始できます。");
//             } else if (pass !== null && pass !== "") {
//                 alert("パスワードが違います。");
//             }
//         }
//     });
// }

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
// 2. 初期化 (通信なしの完全オフライン対応)
async function startQuiz(memberName) {
    if (localStorage.getItem(`quiz_played_${memberName}`)) {
        alert(`${memberName} のクイズはすでに挑戦済みです`);
        return;
    }

    currentMemberName = memberName;
    userAnswers = []; // 回答リセット
    document.getElementById('targetMemberName').textContent = memberName;
    
    // JSのデータから直接クイズリストを取得
    const quizData = allMemberQuizData[memberName];
    
    if (!quizData) {
        alert("問題データが見つかりません。");
        showScreen(screenStart);
        return;
    }

    // 取得したデータをそのままセット
    currentQuizList = quizData;
    currentQuizIndex = 0;
    
    btnQuizNext.disabled = true;
    showScreen(screenQuiz);
    loadQuestion(); // 問題を表示
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
// 自分の回答リスト生成機能
// -----------------------------------------

function generateUserAnswerList() {
    let html = "<p style='font-weight:bold; margin-bottom:10px; border-bottom:2px solid #ccc; padding-bottom:5px;'>【答え合わせ】</p>";
    
    currentQuizList.forEach((q, index) => {
        const uAns = userAnswers[index] || "未回答";
        const isCorrect = (q.answer === uAns);
        
        html += `<div class="answer-item">
            <p class="answer-q">Q${index + 1}. ${q.q}</p>
            <p>あなたの回答: <span class="${isCorrect ? 'answer-correct' : 'answer-wrong'}">${uAns}</span></p>
            ${!isCorrect ? `<p class="answer-true-ans">正解: ${q.answer}</p>` : ''}
        </div>`;
    });
    return html;
}

// -----------------------------------------
// 3. 採点・結果発表 (通信なしの完全オフライン対応)
// -----------------------------------------
async function finishGame() {
    document.getElementById('quizText').textContent = "採点中...";
    document.getElementById('quizOptions').innerHTML = "";
    btnQuizNext.style.display = 'none';

    let score = 0;
    const maxScore = currentQuizList.length;

    // 端末の中で丸付けを行う
    currentQuizList.forEach((q, index) => {
        if (q.answer === userAnswers[index]) {
            score++;
        }
    });

    // データベース(Supabase)への保存は「電波がある時だけ」試みる
    try {
        await sb.from('game_results').insert([{ 
            player_name: playerName,
            target_member: currentMemberName,
            score: score
        }]);
    } catch (e) {
        console.warn('オフラインのため成績送信をスキップしました');
    }

    // プレイ済みの記録
    localStorage.setItem(`quiz_played_${currentMemberName}`, 'true');
    btnQuizNext.style.display = 'block';

    // 結果画面の表示
    if (score === maxScore) {
        document.getElementById('resultMemberName').textContent = currentMemberName;
        document.getElementById('winnerNameDisplay').textContent = playerName;
        
        const answersElSpecial = document.getElementById('resultAnswersSpecial');
        if (answersElSpecial) answersElSpecial.innerHTML = generateUserAnswerList();

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

        const answersElNormal = document.getElementById('resultAnswersNormal');
        if (answersElNormal) answersElNormal.innerHTML = generateUserAnswerList();

        showScreen(screenResultNormal);
    }
}

document.getElementById('btnBackToStart').addEventListener('click', () => showScreen(screenStart));
document.getElementById('btnGameRetry').addEventListener('click', () => {
    createMemberList(); // リストを最新状態にしてから画面移動
    showScreen(screenSelect);
});
document.getElementById('btnGameRetrySpecial').addEventListener('click', () => {
    createMemberList(); // リストを最新状態にしてから画面移動
    showScreen(screenSelect);
});


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
        date: "2026.03.02",
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
                if (new Date() > new Date("2026-03-31T23:59:59")) { 
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
                if (new Date() > new Date("2026-03-31T23:59:59")) { 
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

// =========================================
// 配信(YouTube)タブの切り替え処理
// =========================================
const streamTabs = document.querySelectorAll('.stream-tab');
const youtubeIframe = document.getElementById('youtubeIframe');
const youtubeLink = document.getElementById('youtubeLink');

if (streamTabs.length > 0) {
    streamTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            streamTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const videoId = tab.getAttribute('data-id');
            
            if (youtubeIframe) {
                youtubeIframe.src = `https://www.youtube.com/embed/${videoId}`;
            }
            if (youtubeLink) {
                youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
            }
        });
    });
}

// =========================================
// アーティスト＆セットリスト機能
// =========================================

// セットリストのデータ（検索キーワードを設定）
// セットリストのデータ（検索キーワードを設定）
const setlistData = {
    "artist-day1": [
        {
            artist: "マカロニえんぴつ",
            songs: [
                { title: "哀しみロック", search: "マカロニえんぴつ 哀しみロック" },
                { title: "ワンドリンク別", search: "マカロニえんぴつ ワンドリンク別" },
                { title: "青春と一瞬", search: "マカロニえんぴつ 青春と一瞬" },
                { title: "洗濯機と君とラヂオ", search: "マカロニえんぴつ 洗濯機と君とラヂオ" }
            ]
        },
        {
            artist: "ヒトリエ",
            songs: [
                { title: "絶対的", search: "ヒトリエ 絶対的" },
                { title: "トーキーダンス", search: "ヒトリエ トーキーダンス" },
                { title: "極夜灯", search: "ヒトリエ 極夜灯" },
                { title: "目眩", search: "ヒトリエ 目眩" },
                { title: "コヨーテエンゴースト", search: "ヒトリエ コヨーテエンゴースト" },
                { title: "ステレオジュブナイル", search: "ヒトリエ ステレオジュブナイル" }
            ]
        },
        {
            artist: "ギソロオムニバス",
            songs: [
                { title: "あの夏に咲け", search: "ヨルシカ あの夏に咲け" },
                { title: "泥の分際で私だけの大切を奪おうだなんて", search: "ツユ 泥の分際で私だけの大切を奪おうだなんて" },
                { title: "三月がずっと続けばいい", search: "ヨルシカ 三月がずっと続けばいい" },
                { title: "ミラーチューン", search: "ずっと真夜中でいいのに ミラーチューン" },
                { title: "ジャンキーナイトタウンオーケストラ", search: "すりぃ ジャンキーナイトタウンオーケストラ" },
                { title: "ニュー・マイ・ノーマル", search: "Mrs. GREEN APPLE ニュー・マイ・ノーマル" },
                { title: "空想列車", search: "Orangestar 空想列車" }
            ]
        },
        {
            artist: "布袋寅泰",
            songs: [
                { title: "Battle Without Honor or Humanity", search: "布袋寅泰 Battle Without Honor or Humanity" },
                { title: "スリル", search: "布袋寅泰 スリル" },
                { title: "さらば青春の光", search: "布袋寅泰 さらば青春の光" },
                { title: "NOBADY IS PARFECT", search: "布袋寅泰 NOBADY IS PARFECT" },
                { title: "バンビーナ", search: "布袋寅泰 バンビーナ" },
                { title: "POISON", search: "布袋寅泰 POISON" }
            ]
        },
        {
            artist: "サンボマスター",
            songs: [
                { title: "世界を変えさせておくれよ", search: "サンボマスター 世界を変えさせておくれよ" },
                { title: "青春狂騒曲", search: "サンボマスター 青春狂騒曲" },
                { title: "オレたちのすすむ道を悲しみで閉ざさないで", search: "サンボマスター オレたちのすすむ道を悲しみで閉ざさないで" },
                { title: "光のロック", search: "サンボマスター 光のロック" },
                { title: "世界はそれを愛と呼ぶんだぜ", search: "サンボマスター 世界はそれを愛と呼ぶんだぜ" },
                { title: "花束", search: "サンボマスター 花束" }
            ]
        }
    ],
    "artist-day2": [
        {
            artist: "BLUE ENCOUNT",
            songs: [
                { title: "DAY×DAY", search: "BLUE ENCOUNT DAY×DAY" },
                { title: "Survivor", search: "BLUE ENCOUNT Survivor" },
                { title: "バッドパラドックス", search: "BLUE ENCOUNT バッドパラドックス" },
                { title: "ポラリス", search: "BLUE ENCOUNT ポラリス" },
                { title: "VS", search: "BLUE ENCOUNT VS" },
                { title: "コンパス", search: "BLUE ENCOUNT コンパス" }
            ]
        },
        {
            artist: "コンテンポラリーな生活・ネクライトーキー",
            songs: [
                { title: "プロポーズ", search: "コンテンポラリーな生活 プロポーズ" },
                { title: "鉄腕ナインティーン", search: "ネクライトーキー 鉄腕ナインティーン" },
                { title: "ジャックポッドなら踊らにゃソンソン", search: "ネクライトーキー ジャックポッドなら踊らにゃソンソン" },
                { title: "夕暮れ先生", search: "ネクライトーキー 夕暮れ先生" },
                { title: "誰が為にCHAKAPOCOは鳴る", search: "ネクライトーキー 誰が為にCHAKAPOCOは鳴る" },
                { title: "bloom", search: "ネクライトーキー bloom" }
            ]
        },
        {
            artist: "ELLEGARDEN",
            songs: [
                { title: "チーズケーキ・ファクトリー", search: "ELLEGARDEN チーズケーキ・ファクトリー" },
                { title: "No.13", search: "ELLEGARDEN No.13" },
                { title: "Salamander", search: "ELLEGARDEN Salamander" },
                { title: "Missing", search: "ELLEGARDEN Missing" },
                { title: "Make a Wish", search: "ELLEGARDEN Make a Wish" },
                { title: "スターフィッシュ", search: "ELLEGARDEN スターフィッシュ" },
                { title: "Strawberry Margarita", search: "ELLEGARDEN Strawberry Margarita" }
            ]
        }
    ],
    // ▼ 今回追加した3日目 ▼
    "artist-day3": [
        {
            artist: "さかりくオムニバス",
            songs: [
                { title: "スーパースターになったら", search: "back number スーパースターになったら" },
                { title: "ミラーボールとシンデレラ", search: "back number ミラーボールとシンデレラ" },
                { title: "シシカバブー", search: "ゆず シシカバブー" },
                { title: "LOVE & PEACH", search: "ゆず LOVE & PEACH" },
                { title: "マカロン(FalKKonE cover)", search: "マカロン FalKKonE" },
                { title: "オーネヘルツ", search: "オーネヘルツ" },
                { title: "残響", search: "残響" },
                { title: "stay with me", search: "stay with me" }
            ]
        },
        {
            artist: "ヨルシカ",
            songs: [
                { title: "海底にて", search: "ヨルシカ 海底にて" },
                { title: "夕凪、某、花惑い", search: "ヨルシカ 夕凪、某、花惑い" },
                { title: "八月、某、月明かり", search: "ヨルシカ 八月、某、月明かり" },
                { title: "心に穴が空いた", search: "ヨルシカ 心に穴が空いた" },
                { title: "ルバート", search: "ヨルシカ ルバート" },
                { title: "雨とカプチーノ", search: "ヨルシカ 雨とカプチーノ" },
                { title: "六月は雨上がりの街を書く", search: "ヨルシカ 六月は雨上がりの街を書く" },
                { title: "フラッシュバック", search: "ヨルシカ フラッシュバック" },
                { title: "だから僕は音楽を辞めた", search: "ヨルシカ だから僕は音楽を辞めた" }
            ]
        },
        {
            artist: "BUMP OF CHICKEN",
            songs: [
                { title: "虹を待つ人", search: "BUMP OF CHICKEN 虹を待つ人" },
                { title: "月虹", search: "BUMP OF CHICKEN 月虹" },
                { title: "クロノスタシス", search: "BUMP OF CHICKEN クロノスタシス" },
                { title: "Flare", search: "BUMP OF CHICKEN Flare" },
                { title: "シリウス", search: "BUMP OF CHICKEN シリウス" },
                { title: "Voyager,flyby", search: "BUMP OF CHICKEN Voyager,flyby" },
                { title: "天体観測", search: "BUMP OF CHICKEN 天体観測" }
            ]
        },
        {
            artist: "みさとオムニバス",
            songs: [
                { title: "踊ろうぜ", search: "踊ろうぜ" },
                { title: "言って。", search: "ヨルシカ 言って。" },
                { title: "ショートショート", search: "ポルカドットスティングレイ ショートショート" },
                { title: "ヤバみ", search: "ヤバイTシャツ屋さん ヤバみ" },
                { title: "笑顔のループ", search: "AAA 笑顔のループ" },
                { title: "Fake!Fake!", search: "Fake!Fake!" },
                { title: "やっぱり雨は降るんだね", search: "ツユ やっぱり雨は降るんだね" },
                { title: "パステルレイン", search: "三月のパンタシア パステルレイン" },
                { title: "キミノヨゾラ哨戒班", search: "Orangestar キミノヨゾラ哨戒班" }
            ]
        },
        {
            artist: "米津玄師",
            songs: [
                { title: "おはよう", search: "米津玄師 おはよう" },
                { title: "LOSER", search: "米津玄師 LOSER" },
                { title: "パンダヒーロー", search: "ハチ パンダヒーロー" }, // ハチ名義の方がヒットしやすいため調整
                { title: "IRIS OUT", search: "米津玄師 IRIS OUT" },
                { title: "KICK BACK", search: "米津玄師 KICK BACK" },
                { title: "ゴーゴー幽霊船", search: "米津玄師 ゴーゴー幽霊船" },
                { title: "爱丽丝", search: "米津玄師 爱丽丝" },
                { title: "眼福", search: "米津玄師 眼福" },
                { title: "灰色と青", search: "米津玄師 灰色と青" },
                { title: "Nightawks", search: "米津玄師 Nighthawks" } // 検索エラー防止のためNighthawksで検索
            ]
        }
    ],

    "artist-day4": [
        {
            artist: "ずっと真夜中でいいのに。",
            songs: [
                { title: "花一匁", search: "ずっと真夜中でいいのに 花一匁" },
                { title: "感冴えて悔しいわ", search: "ずっと真夜中でいいのに 勘冴えて悔しいわ" },
                { title: "君がいて水になる", search: "ずっと真夜中でいいのに 君がいて水になる" },
                { title: "海馬成長痛", search: "ずっと真夜中でいいのに 海馬成長痛" },
                { title: "暗く黒く", search: "ずっと真夜中でいいのに 暗く黒く" }
            ]
        },
        {
            artist: "かいせいオムニバス",
            songs: [
                { title: "女々しくて", search: "ゴールデンボンバー 女々しくて" },
                { title: "Take What U Want", search: "ONE OK ROCK Take What You Want" },
                { title: "Smells Like Teen Sprint", search: "Nirvana Smells Like Teen Spirit" },
                { title: "Ballon Ballon", search: "BRADIO Ballon Ballon" },
                { title: "Getting Along(Royal Republic)", search: "Royal Republic Getting Along" },
                { title: "日本の米は世界一", search: "打首獄門同好会 日本の米は世界一" },
                { title: "イケナイ太陽", search: "ORANGE RANGE イケナイ太陽" }
            ]
        },
        {
            artist: "Orangestar",
            songs: [
                { title: "雨き声残響", search: "Orangestar 雨き声残響" },
                { title: "霽れを待つ", search: "Orangestar 霽れを待つ" },
                { title: "Aloud", search: "Orangestar Aloud" },
                { title: "快晴", search: "Orangestar 快晴" },
                { title: "Nadir", search: "Orangestar Nadir" },
                { title: "未完成タイムリミッター", search: "Orangestar 未完成タイムリミッター" },
                { title: "DAYBREAK FRONTLINE", search: "Orangestar DAYBREAK FRONTLINE" }
            ]
        },
        {
            artist: "僕の人生オムニバス",
            songs: [
                { title: "Canon Rock", search: "Canon Rock" },
                { title: "前前前世", search: "RADWIMPS 前前前世" },
                { title: "千本桜", search: "黒うさP 千本桜" },
                { title: "飛行艇", search: "King Gnu 飛行艇" },
                { title: "Re:make", search: "ONE OK ROCK Re:make" },
                { title: "Wherever you are", search: "ONE OK ROCK Wherever you are" },
                { title: "キミシダイ列車", search: "ONE OK ROCK キミシダイ列車" },
                { title: "完全感覚Dreamer", search: "ONE OK ROCK 完全感覚Dreamer" }
            ]
        },
        {
            artist: "？？？",
            songs: [
                // ★ オリジナル曲のため、search を null にしてアイコンを出さないように設定
                { title: "ミリオンベル(オリジナル)", search: null }, 
                { title: "ambitious japan", search: "TOKIO AMBITIOUS JAPAN" }
            ]
        }
    ]
}; // setlistData の閉じカッコ

// アプリアイコン（SVG）

// YouTube
const iconYT = `<svg class="app-icon" style="min-width:14px; flex-shrink:0;" viewBox="0 0 24 24"><path fill="currentColor" d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.54 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.54-5.58z"></path><polygon fill="#FF0000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>`;

// YouTube Music
const iconYTM = `<svg class="app-icon" style="min-width:16px; height:16px; flex-shrink:0;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FF0000"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFFFFF" stroke-width="1.5"/><polygon points="10,8 15.5,12 10,16" fill="#FFFFFF"/></svg>`;
// Spotify
const iconSP = `<svg class="app-icon" style="min-width:14px; flex-shrink:0;" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.6 14.4c-.18.3-.54.4-.84.22-2.3-1.4-5.2-1.72-8.62-.94-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 3.76-.84 6.96-.48 9.52 1.1.3.18.4.54.22.84zm1.2-3.36c-.22.36-.7.48-1.06.26-2.64-1.62-6.68-2-10.22-1.1-.4.1-.8-.14-.9-.54-.1-.4.14-.8.54-.9 4-.98 8.44-.56 11.4 1.24.36.2.48.68.26 1.04zm.1-3.48c-3.16-1.88-8.4-2.06-11.44-1.14-.48.14-1-.12-1.14-.6-.14-.48.12-1 .6-1.14 3.52-1.06 9.32-.84 12.98 1.34.42.26.56.8.3 1.22-.24.42-.78.56-1.2.32z"/></svg>`;

// Apple Music
const iconAP = `<svg class="app-icon" style="min-width:14px; flex-shrink:0;" viewBox="0 0 24 24"><path fill="currentColor" d="M21.6 3.1c-.2-.1-.4-.2-.6-.1L8.5 5.5C7.1 5.8 6 6.9 6 8.4v8.3c-.6-.4-1.4-.7-2.2-.7C1.7 16 0 17.5 0 19.5S1.7 23 3.8 23s3.8-1.5 3.8-3.5V8.4c0-.3.2-.6.5-.7l12.5-2.5c.3-.1.5.1.5.4v7.7c-.6-.4-1.4-.7-2.2-.7-2.1 0-3.8 1.5-3.8 3.5s1.7 3.5 3.8 3.5 3.8-1.5 3.8-3.5V4c0-.4-.2-.7-.6-.9z"/></svg>`;
// LINE MUSIC (元の音符アイコンの上に同じ角度・幅の斜め線を追加)
const iconLI = `<svg class="app-icon" style="min-width:14px; flex-shrink:0;" viewBox="0 0 24 24">
    <g transform="translate(1.2, 3) scale(0.9)">
        <polygon fill="currentColor" points="6,1.1 21.6,-1.7 21.6,1.2 6,4.0" />
        <path fill="currentColor" d="M21.6 3.1c-.2-.1-.4-.2-.6-.1L8.5 5.5C7.1 5.8 6 6.9 6 8.4v8.3c-.6-.4-1.4-.7-2.2-.7C1.7 16 0 17.5 0 19.5S1.7 23 3.8 23s3.8-1.5 3.8-3.5V8.4c0-.3.2-.6.5-.7l12.5-2.5c.3-.1.5.1.5.4v7.7c-.6-.4-1.4-.7-2.2-.7-2.1 0-3.8 1.5-3.8 3.5s1.7 3.5 3.8 3.5 3.8-1.5 3.8-3.5V4c0-.4-.2-.7-.6-.9z"/>
    </g>
</svg>`;
// 各種音楽アプリへの検索リンクを生成
function createServiceLinks(searchQuery) {
    // ★ 検索キーワードが null（オリジナル曲など）の場合は、リンクのHTMLを一切出さない
    if (!searchQuery) {
        return ""; 
    }

    const enc = encodeURIComponent(searchQuery);
    return `
        <div class="song-links">
            <a href="https://www.youtube.com/results?search_query=${enc}" target="_blank" class="link-yt" title="YouTube">${iconYT}</a>
            <a href="https://music.youtube.com/search?q=${enc}" target="_blank" class="link-ytm" title="YouTube Music">${iconYTM}</a>
            <a href="https://open.spotify.com/search/$$${enc}" target="_blank" class="link-sp" title="Spotify">${iconSP}</a>
            <a href="https://music.apple.com/jp/search?term=${enc}" target="_blank" class="link-ap" title="Apple Music">${iconAP}</a>
            <a href="https://music.line.me/webapp/search?query=${enc}" target="_blank" class="link-li" title="LINE MUSIC">${iconLI}</a>
        </div>
    `;
}

// リストを描画する関数
const artistListContainer = document.getElementById('artistListContainer');
const artistTabsList = document.querySelectorAll('.artist-tab');

function renderArtistList(dayId) {
    if (!artistListContainer) return;
    
    // ★ 4日目は指定日時（2026/3/21 20:00）までシークレットにする
    if (dayId === "artist-day4") {
        const now = new Date();
        const unlockDate = new Date("2026-03-21T20:00:00+09:00");
        
        // 今の時間が解禁時間より前なら、COMING SOONを出す
        if (now < unlockDate) {
            artistListContainer.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; border: 2px dashed #ccc; border-radius: 12px; background: #fafafa;">
                    <h3 style="color:#111; font-family:'Anton', sans-serif; font-size:2rem;">COMING SOON...</h3>
                </div>
            `;
            return;
        }
    }

    const data = setlistData[dayId];
    if (!data) return;

    let html = `<div>`;
    data.forEach(artistBlock => {
        html += `
            <div class="artist-card">
                <h3 class="artist-name">${artistBlock.artist}</h3>
                <ul class="setlist">
        `;
        artistBlock.songs.forEach((song, index) => {
            html += `
                <li class="setlist-item">
                    <span class="song-title">${index + 1}. ${song.title}</span>
                    ${createServiceLinks(song.search)}
                </li>
            `;
        });
        html += `</ul></div>`;
    });
    html += `</div>`;

    artistListContainer.innerHTML = html;
}

// タブ切り替えイベント
if (artistTabsList.length > 0) {
    artistTabsList.forEach(tab => {
        tab.addEventListener('click', () => {
            artistTabsList.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderArtistList(tab.getAttribute('data-target'));
        });
    });
    // 初期表示はDAY1
    renderArtistList("artist-day1");
}