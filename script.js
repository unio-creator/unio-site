let gameData = {}; // JSONから動的に読み込む

const articleList = document.querySelector("#articleList");
const articleDetail = document.querySelector("#articleDetail");
const selectedGameName = document.querySelector("#selectedGameName");
const gameTabs = document.querySelectorAll(".game-tab");
const murmurText = document.querySelector("#murmurText");
const murmurTime = document.querySelector("#murmurTime");
const newsContainer = document.querySelector(".news ul");
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

// JSONファイルを読み込む
async function loadData() {
  try {
    // ゲーム記事データを読み込む
    const gamesResponse = await fetch("data/games.json");
    gameData = await gamesResponse.json();

    // 最新情報を読み込む
    const newsResponse = await fetch("data/news.json");
    const newsData = await newsResponse.json();
    renderNews(newsData);

    // つぶやきを読み込む
    const murmurResponse = await fetch("data/murmur.json");
    const murmurData = await murmurResponse.json();
    loadMurmur(murmurData);

    // 初期化完了
    selectGame("fgo");
  } catch (error) {
    console.error("データの読み込みに失敗しました:", error);
  }
}

function renderNews(newsData) {
  if (!newsContainer) return;
  newsContainer.innerHTML = newsData
    .map(item => `<li>${item.text}</li>`)
    .join("");
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

function loadMurmur(murmurData) {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    // ローカルストレージに保存されている場合はそれを使用
    const data = JSON.parse(saved);
    murmurText.textContent = data.text;
    murmurTime.dateTime = data.iso;
    murmurTime.textContent = `${formatDateTime(new Date(data.iso))} 更新`;
  } else {
    // JSONファイルのデフォルト値を使用
    murmurText.textContent = murmurData.text;
    murmurTime.textContent = murmurData.date;
  }
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// データ読み込み開始
loadData();
