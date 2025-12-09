console.log("JS IS WORKING!");
let currentLang = sessionStorage.getItem("lang") || "en";

function setLang(lang) {
    currentLang = lang;
    sessionStorage.setItem("lang", lang);
    loadPage();
}

function loadPage() {
    if (location.pathname.includes("index.html")) loadHome();
    if (location.pathname.includes("article.html")) loadArticle();
}

function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("hidden");
}

async function loadHome() {
    const data = await fetch(`./theories_${currentLang}.json`).then(res => res.json());
    const lang = await fetch(`./lang_${currentLang}.json`).then(res => res.json());

    document.getElementById("hero-title").textContent = lang.hero_title;
    document.getElementById("hero-subtitle").textContent = lang.hero_subtitle;

    const container = document.getElementById("theory-container");
    const dropdown = document.getElementById("dropdown");

    container.innerHTML = "";
    dropdown.innerHTML = "";

    data.forEach(t => {
        const d = document.createElement("div");
        d.textContent = t.title;
        d.className = "drop-item";
        d.onclick = () => openArticle(t.id);
        dropdown.appendChild(d);

        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openArticle(t.id);

        const img = t.image ? t.image[0] : "placeholder.jpg";

        card.innerHTML = `
            <img src="img/${img}">
            <h3>${t.title}</h3>
            <p>${t.short}</p>
        `;

        container.appendChild(card);
    });
}

function openArticle(id) {
    sessionStorage.setItem("article", id);
    location.href = "article.html";
}

async function loadArticle() {
    const id = sessionStorage.getItem("article");
    if (!id) return;

    const data = await fetch(`./theories_${currentLang}.json`).then(res => res.json());
    const article = data.find(t => t.id === id);

    const container = document.getElementById("article-content");
    container.innerHTML = `<h1>${article.title}</h1>`;

    article.image?.forEach(img => {
        container.innerHTML += `<img class="article-img" src="img/${img}">`;
    });

    article.content?.forEach(block => {
        container.innerHTML += `<p>${block.text}</p>`;
    });
}

window.onload = loadPage;



