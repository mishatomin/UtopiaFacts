console.log("JS LOADED OK");

let currentLang = sessionStorage.getItem("lang") || "en";

// === Main Page Loader ===
async function loadHome() {
    console.log("loadHome() started");

    try {
        const response = await fetch(`theories_${currentLang}.json`);
        console.log("Fetching:", `theories_${currentLang}.json`);

        const data = await response.json();
        console.log("Loaded JSON:", data);

        const container = document.getElementById("theory-container");
        const dropdown = document.getElementById("dropdown");

        container.innerHTML = "";
        dropdown.innerHTML = "";

        data.forEach(t => {
            // Dropdown item
            const item = document.createElement("div");
            item.className = "drop-item";
            item.textContent = t.title;
            item.onclick = () => openArticle(t.id);
            dropdown.appendChild(item);

            // Grid Cards
            const card = document.createElement("div");
            card.className = "card";
            card.onclick = () => openArticle(t.id);

            card.innerHTML = `
                <img src="img/${t.image[0]}" class="thumb">
                <h3>${t.title}</h3>
                <p>${t.short}</p>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading theories:", err);
    }
}


// === Open Article Page ===
function openArticle(id) {
    sessionStorage.setItem("article", id);
    window.location.href = "article.html";
}


// === Article Page Loader ===
async function loadArticle() {
    console.log("loadArticle() started");

    const id = sessionStorage.getItem("article");
    if (!id) return;

    try {
        const response = await fetch(`theories_${currentLang}.json`);
        const data = await response.json();

        const article = data.find(t => t.id === id);
        const content = document.getElementById("article-content");

        content.innerHTML = `
            <h1>${article.title}</h1>
        `;

        // Images
        article.image.forEach(img => {
            content.innerHTML += `<img src="img/${img}" class="article-img">`;
        });

        // Paragraphs
        article.content.forEach(txt => {
            content.innerHTML += `<p>${txt.text}</p>`;
        });

    } catch (err) {
        console.error("Error loading article:", err);
    }
}


// === Language Switcher ===
function setLang(lang) {
    console.log("Language changed to", lang);

    currentLang = lang;
    sessionStorage.setItem("lang", lang);

    if (window.location.pathname.includes("index")) loadHome();
    if (window.location.pathname.includes("article")) loadArticle();
}


// === Dropdown Menu ===
function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("hidden");
}


// === AUTO RUN on page load ===
window.onload = () => {
    console.log("window.onload fired, lang =", currentLang);

    if (window.location.pathname.includes("index")) {
        loadHome();
    }
    if (window.location.pathname.includes("article")) {
        loadArticle();
    }
};




