console.log("JS LOADED!");

let currentLang = "en";
let theories = [];

// ----------------------
// LOAD LANGUAGE
// ----------------------
async function loadLanguage(lang) {
    const res = await fetch(`lang_${lang}.json`);
    const t = await res.json();

    const title = document.getElementById("hero-title");
    const subtitle = document.getElementById("hero-subtitle");

    if (title) title.textContent = t.hero_title;
    if (subtitle) subtitle.textContent = t.hero_subtitle;

  
    const footer = document.querySelector(".footer-quote");
    if (footer && t.footer_quote) {
        footer.textContent = t.footer_quote;
    }
}

// ----------------------
// LOAD THEORIES
// ----------------------
async function loadTheories(lang) {
    const res = await fetch(`theories_${lang}.json`);
    theories = await res.json();

    fillDropdown();
    fillCards();

    
    if (document.getElementById("article-content")) {
        fillArticle();
    }
}

// ----------------------
// DROPDOWN
// ----------------------
function fillDropdown() {
    const dd = document.getElementById("dropdown");
    if (!dd) return;

    dd.innerHTML = "";

    theories.forEach(t => {
        const btn = document.createElement("button");
        btn.className = "dropdown-item";
        btn.textContent = t.title;
        btn.onclick = () => openArticle(t.id);
        dd.appendChild(btn);
    });
}

function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("hidden");
}

// ----------------------
// CARDS
// ----------------------
function fillCards() {
    const grid = document.getElementById("theory-container");
    if (!grid) return;

    grid.innerHTML = "";

    theories.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openArticle(t.id);

        const img = document.createElement("img");
        img.src = "./img/" + t.image[0];

        const title = document.createElement("h3");
        title.textContent = t.title;

        const short = document.createElement("p");
        short.textContent = t.short;

        card.append(img, title, short);
        grid.appendChild(card);
    });
}

// ----------------------
// ARTICLE PAGE
// ----------------------
function fillArticle() {
    const section = document.getElementById("article-content");
    if (!section) return;

   
    section.innerHTML = "";

    const id = sessionStorage.getItem("currentTheoryId");
    if (!id) return;

    const t = theories.find(x => x.id === id);
    if (!t) return;

    const h1 = document.createElement("h1");
    h1.textContent = t.title;
    section.appendChild(h1);

    t.image.forEach(imgName => {
        const img = document.createElement("img");
        img.className = "article-img";
        img.src = "./img/" + imgName;
        section.appendChild(img);
    });

    t.content.forEach(block => {
        const p = document.createElement("p");
        p.textContent = block.text;
        section.appendChild(p);
    });
}

function openArticle(id) {
    sessionStorage.setItem("currentTheoryId", id);
    location.href = "article.html";
}

// ----------------------
// LANGUAGE SWITCH
// ----------------------
function setLang(lang) {
    currentLang = lang;
    sessionStorage.setItem("lang", lang);

    loadLanguage(lang);
    loadTheories(lang);

    document.getElementById("en-btn").classList.toggle("active", lang === "en");
    document.getElementById("fi-btn").classList.toggle("active", lang === "fi");
}

// ----------------------
// START
// ----------------------
window.addEventListener("DOMContentLoaded", () => {
    const lang = sessionStorage.getItem("lang") || "en";
    setLang(lang);
});









