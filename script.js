console.log("JS LOADED!");

// ------------------------------
// GLOBAL STATE
// ------------------------------
let currentLang = "en";
let theories = [];

// ------------------------------
// LANGUAGE
// ------------------------------
async function loadLanguage(lang) {
    try {
        const res = await fetch(`lang_${lang}.json`);
        const data = await res.json();

        const titleEl = document.getElementById("hero-title");
        const subEl = document.getElementById("hero-subtitle");

        // Эти элементы есть только на index.html, поэтому проверяем
        if (titleEl) titleEl.textContent = data.hero_title;
        if (subEl) subEl.textContent = data.hero_subtitle;

    } catch (err) {
        console.error("Language load error:", err);
    }
}

// ------------------------------
// LOAD THEORIES (EN / FI)
// ------------------------------
async function loadTheories(lang) {
    try {
        const res = await fetch(`theories_${lang}.json`);
        theories = await res.json();
        console.log("Theories loaded:", theories);

        buildDropdown();
        buildCards();
    } catch (err) {
        console.error("Theories load error:", err);
    }
}

// ------------------------------
// BUILD DROPDOWN MENU
// ------------------------------
function buildDropdown() {
    const dropdown = document.getElementById("dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    theories.forEach(item => {
        const div = document.createElement("div");
        div.className = "drop-item";
        div.textContent = item.title;
        div.onclick = () => openArticle(item.id);
        dropdown.appendChild(div);
    });
}

// ------------------------------
// BUILD CARDS ON HOME PAGE
// ------------------------------
function buildCards() {
    const container = document.getElementById("theory-container");
    if (!container) return; // на article.html этого блока нет

    container.innerHTML = "";

    theories.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openArticle(item.id);

        const img = document.createElement("img");
        // image — это массив имён файлов, папка называется img
        img.src = "img/" + item.image[0];
        img.alt = item.title;

        const title = document.createElement("h3");
        title.textContent = item.title;

        const p = document.createElement("p");
        p.textContent = item.short;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(p);

        container.appendChild(card);
    });
}

// ------------------------------
// OPEN ARTICLE (NAVIGATE)
// ------------------------------
function openArticle(id) {
    sessionStorage.setItem("articleId", id);
    window.location.href = "article.html"; // без s
}

// ------------------------------
// LOAD ARTICLE PAGE CONTENT
// ------------------------------
async function loadArticlePage() {
    const articleSection = document.getElementById("article-content");
    if (!articleSection) return; // мы не на странице статьи

    const id = sessionStorage.getItem("articleId");
    if (!id) {
        articleSection.innerHTML = "<h2>Article not found.</h2>";
        return;
    }

    try {
        const res = await fetch(`theories_${currentLang}.json`);
        const data = await res.json();
        const item = data.find(t => t.id === id);

        if (!item) {
            articleSection.innerHTML = "<h2>Article not found.</h2>";
            return;
        }

        let html = `<h1>${item.title}</h1>`;

        // картинки
        item.image.forEach(file => {
            html += `<img src="img/${file}" class="article-img" alt="${item.title}">`;
        });

        // текстовые блоки
        item.content.forEach(block => {
            html += `<p>${block.text}</p>`;
        });

        articleSection.innerHTML = html;

        // заполнить dropdown и на странице статьи
        theories = data;
        buildDropdown();

    } catch (err) {
        console.error("Article load error:", err);
        articleSection.innerHTML = "<h2>Error loading article.</h2>";
    }
}

// ------------------------------
// MENU TOGGLE
// ------------------------------
function toggleMenu() {
    const dd = document.getElementById("dropdown");
    if (dd) dd.classList.toggle("hidden");
}

// ------------------------------
// SWITCH LANGUAGE
// ------------------------------
function setLang(lang) {
    currentLang = lang;
    sessionStorage.setItem("lang", lang);

    // подсветка активной кнопки
    const enBtn = document.getElementById("en-btn");
    const fiBtn = document.getElementById("fi-btn");
    if (enBtn && fiBtn) {
        enBtn.classList.toggle("active", lang === "en");
        fiBtn.classList.toggle("active", lang === "fi");
    }

    loadLanguage(lang);
    loadTheories(lang);

    // если мы на странице статьи — перегружаем её контент на новом языке
    setTimeout(loadArticlePage, 100);
}

// ------------------------------
// STARTUP
// ------------------------------
window.onload = () => {
    const savedLang = sessionStorage.getItem("lang") || "en";
    currentLang = savedLang;

    setLang(currentLang);      // язык + теории (карточки + меню)
    loadArticlePage();         // если мы на article.html — подгрузит статью
};





