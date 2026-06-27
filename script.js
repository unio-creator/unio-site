const gameData = {
  fgo: {
    name: "FGO",
    articles: [
      {
        title: "イベント周回メモ",
        date: "2026-06-25",
        body: "素材集めをしながら、礼装の積み方や周回しやすい編成を記録していく予定です。",
        points: ["欲しい素材を先に決める", "無理なく回れる編成を優先", "交換所の取り忘れを確認"]
      },
      {
        title: "推しサーヴァント語り",
        date: "2026-06-25",
        body: "好きなサーヴァントの魅力、シナリオで印象に残った場面、育成方針をまとめます。",
        points: ["好きなところ", "使っていて楽しい場面", "今後強化したいポイント"]
      }
    ]
  },
  starrail: {
    name: "崩壊スターレイル",
    articles: [
      {
        title: "開拓日誌",
        date: "2026-06-25",
        body: "ストーリー進行、育成状況、気になったキャラクターをゆるく記録します。",
        points: ["ストーリー感想", "育成中のキャラ", "次に挑戦したいコンテンツ"]
      },
      {
        title: "編成メモ",
        date: "2026-06-25",
        body: "手持ちに合わせたパーティや、使ってみて楽しかった組み合わせを残します。",
        points: ["役割を分けて考える", "遺物は少しずつ更新", "好きなキャラを活かす"]
      }
    ]
  },
  shironeko: {
    name: "白猫プロジェクト",
    articles: [
      {
        title: "島掘り進捗",
        date: "2026-06-25",
        body: "ジュエル回収やイベント消化の進み具合をまとめる場所です。",
        points: ["未クリア確認", "報酬回収", "気になったイベントをメモ"]
      },
      {
        title: "キャラ使用感",
        date: "2026-06-25",
        body: "触っていて楽しいキャラ、操作感が好きなキャラを中心に書いていきます。",
        points: ["スキル演出", "操作のしやすさ", "高難度での印象"]
      }
    ]
  },
  wuthering: {
    name: "鳴潮",
    articles: [
      {
        title: "探索メモ",
        date: "2026-06-25",
        body: "マップ探索で見つけたこと、音骸集め、気になった風景をまとめます。",
        points: ["探索ルート", "音骸集め", "スクリーンショット候補"]
      },
      {
        title: "育成記録",
        date: "2026-06-25",
        body: "キャラクター育成や武器、音骸の更新状況を残していきます。",
        points: ["優先して育てるキャラ", "素材集め", "戦闘で試したこと"]
      }
    ]
  },
  nte: {
    name: "NTE",
    articles: [
      {
        title: "気になるポイント",
        date: "2026-06-25",
        body: "これから遊びながら、世界観やシステムで気になったことをまとめる予定です。",
        points: ["世界観", "キャラクター", "遊んでみたい要素"]
      },
      {
        title: "プレイ予定メモ",
        date: "2026-06-25",
        body: "開始前に調べたいこと、始めたら確認したいことを置いておきます。",
        points: ["事前情報", "リリース後に試すこと", "記事化したいテーマ"]
      }
    ]
  },
  dbd: {
    name: "DBD",
    articles: [
      {
        title: "今日の儀式メモ",
        date: "2026-06-25",
        body: "試合で起きたこと、反省点、次に意識したいことを短くまとめます。",
        points: ["チェイスの反省", "発電機意識", "パーク構成メモ"]
      },
      {
        title: "パーク構成置き場",
        date: "2026-06-25",
        body: "使ってみたい構成や、相性がよかった組み合わせを記録します。",
        points: ["生存者構成", "キラー構成", "使いやすさ"]
      }
    ]
  }
};

const articleList = document.querySelector("#articleList");
const articleDetail = document.querySelector("#articleDetail");
const selectedGameName = document.querySelector("#selectedGameName");
const gameTabs = document.querySelectorAll(".game-tab");
const murmurForm = document.querySelector("#murmurForm");
const murmurInput = document.querySelector("#murmurInput");
const murmurText = document.querySelector("#murmurText");
const murmurTime = document.querySelector("#murmurTime");
const storageKey = "unio-murmur";

function formatDateTime(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function renderArticle(gameKey, articleIndex = 0) {
  const game = gameData[gameKey];
  const article = game.articles[articleIndex];

  selectedGameName.textContent = `${game.name}の記事`;
  articleList.innerHTML = game.articles
    .map((item, index) => `
      <button class="article-button ${index === articleIndex ? "active" : ""}" type="button" data-index="${index}">
        <strong>${item.title}</strong>
        <span>${item.date}</span>
      </button>
    `)
    .join("");

  articleDetail.innerHTML = `
    <time class="article-date" datetime="${article.date}">${article.date}</time>
    <h3>${article.title}</h3>
    <p>${article.body}</p>
    <ul class="article-points">
      ${article.points.map((point) => `<li>${point}</li>`).join("")}
    </ul>
  `;

  articleList.querySelectorAll(".article-button").forEach((button) => {
    button.addEventListener("click", () => {
      renderArticle(gameKey, Number(button.dataset.index));
      articleDetail.focus({ preventScroll: true });
    });
  });
}

function selectGame(gameKey) {
  gameTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.game === gameKey);
  });
  renderArticle(gameKey, 0);
}

gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectGame(tab.dataset.game));
});

function loadMurmur() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    murmurTime.textContent = "サンプル表示";
    return;
  }

  const data = JSON.parse(saved);
  murmurText.textContent = data.text;
  murmurTime.dateTime = data.iso;
  murmurTime.textContent = `${formatDateTime(new Date(data.iso))} 更新`;
}

murmurForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = murmurInput.value.trim();
  if (!text) return;

  const now = new Date();
  localStorage.setItem(storageKey, JSON.stringify({ text, iso: now.toISOString() }));
  murmurText.textContent = text;
  murmurTime.dateTime = now.toISOString();
  murmurTime.textContent = `${formatDateTime(now)} 更新`;
  murmurInput.value = "";
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

selectGame("fgo");
loadMurmur();
