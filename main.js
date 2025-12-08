// ========= CONFIG =========

// пути к JSON-файлам
const LANG_CONFIG = {
  en: "data/theories_en.json",
  fi: "data/theories_fi.json",
};

let currentLang = "en";
let articles = [];
let activeArticleId = null;

// ========= DOM refs =========
const articleListEl = document.getElementById("article-list");
const articleTitleEl = document.getElementById("article-title");
const articleShortEl = document.getElementById("article-short");
const articleBodyEl = document.getElementById("article-body");
const articleMediaEl = document.getElementById("article-media");
const toastEl = document.getElementById("toast");

// ========= Helpers =========

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");

  setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.classList.add("hidden"), 220);
  }, 2400);
}

async function loadArticles(lang) {
  const path = LANG_CONFIG[lang];
  if (!path) {
    console.error("No JSON path for lang:", lang);
    showToast("Language config error");
    return;
  }

  try {
    const res = await fetch(path + `?v=${Date.now()}`); // кэш-байпас для dev
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data.theories)) {
      console.error("Unexpected JSON format. Expected { theories: [] }");
      showToast("JSON format error");
      return;
    }
    articles = data.theories;
    renderArticleList();
    if (articles.length > 0) {
      selectArticle(articles[0].id);
    } else {
      clearArticleView();
    }
  } catch (err) {
    console.error("Failed to load articles:", err);
    showToast("Failed to load articles");
  }
}

function clearArticleView() {
  articleTitleEl.textContent = "No theories found";
  articleShortEl.textContent = "";
  articleBodyEl.innerHTML = "";
  articleMediaEl.innerHTML = "";
}

function renderArticleList() {
  articleListEl.innerHTML = "";
  if (!articles || articles.length === 0) return;

  articles.forEach((article) => {
    const li = document.createElement("li");
    li.className = "article-item";
    li.dataset.id = article.id;

    const title = document.createElement("div");
    title.className = "article-item-title";
    title.textContent = article.title ?? "Untitled";

    const short = document.createElement("div");
    short.className = "article-item-short";
    short.textContent = article.short ?? "";

    li.appendChild(title);
    li.appendChild(short);

    li.addEventListener("click", () => {
      selectArticle(article.id);
    });

    articleListEl.appendChild(li);
  });

  highlightActiveArticle();
}

function highlightActiveArticle() {
  const items = articleListEl.querySelectorAll(".article-item");
  items.forEach((item) => {
    if (item.dataset.id === activeArticleId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function selectArticle(id) {
  const article = articles.find((a) => a.id === id);
  if (!article) return;

  activeArticleId = id;
  highlightActiveArticle();

  articleTitleEl.textContent = article.title ?? "";
  articleShortEl.textContent = article.short ?? "";

  // тело статьи
  articleBodyEl.innerHTML = "";
  if (Array.isArray(article.content)) {
    article.content.forEach((block) => {
      if (!block || !block.text) return;
      const p = document.createElement("p");
      p.textContent = block.text;
      articleBodyEl.appendChild(p);
    });
  }

  // картинки
  articleMediaEl.innerHTML = "";
  if (Array.isArray(article.images) && article.images.length > 0) {
    article.images.forEach((src) => {
      const card = document.createElement("div");
      card.className = "media-card";

      const wrapper = document.createElement("div");
      wrapper.className = "media-image-wrapper";

      const img = document.createElement("img");
      img.src = src;
      img.alt = article.title ?? "Article image";

      wrapper.appendChild(img);
      card.appendChild(wrapper);

      // мини-капшен (опционально)
      const caption = document.createElement("div");
      caption.className = "media-caption";
      caption.textContent = article.title ?? "";
      card.appendChild(caption);

      articleMediaEl.appendChild(card);
    });
  }
}

// ========= Language switch =========

function setupLangSwitch() {
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;

      currentLang = lang;
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      loadArticles(currentLang);
    });
  });
}

// ========= Init =========

document.addEventListener("DOMContentLoaded", () => {
  setupLangSwitch();
  loadArticles(currentLang);
});

