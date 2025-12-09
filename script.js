let currentLang = "en";

function setLang(lang) {
    currentLang = lang;
    sessionStorage.setItem("lang", lang);
    if (location.pathname.includes("index")) loadHome();
    if (location.pathname.includes("article")) loadArticle();
}

function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("hidden");
}

async function loadHome() {
    const data = await fetch(`theories_${currentLang}.json`).then(r => r.json());
    const container = document.getElementById("theory-container");
    const dropdown = document.getElementById("dropdown");

    container.innerHTML = "";
    dropdown.innerHTML = "";

    data.forEach(t => {
        //Dropdown list
        const d = document.createElement("div");
        d.textContent = t.title;
        d.className = "drop-item";
        d.onclick = () => openArticle(t.id);
        dropdown.appendChild(d);

        //Card
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openArticle(t.id);

        card.innerHTML = `
            <img src="img/${t.image[0]}">
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
    const articleId = sessionStorage.getItem("article");
    const data = await fetch(`theories_${currentLang}.json`).then(r => r.json());
    const article = data.find(t => t.id === articleId);

    const section = document.getElementById("article-content");
    section.innerHTML = `<h1>${article.title}</h1>`;

    article.image.forEach(img => {
        section.innerHTML += `<img src="img/${img}">`;
    });

    article.content.forEach(block => {
        section.innerHTML += `<p>${block.text}</p>`;
    });
}

window.onload = () => {
    currentLang = sessionStorage.getItem("lang") || "en";

    if (location.pathname.includes("index")) loadHome();
    if (location.pathname.includes("article")) loadArticle();
};

