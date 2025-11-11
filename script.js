let currentLang = "en";
let langData = {};
let theories = [];

async function loadLang(lang) {
    const resp = await fetch(`data/lang_${lang}.json`);
    langData = await resp.json();
}

async function loadTheories(lang) {
    const resp = await fetch(`data/theories_${lang}.json`);
    theories = await resp.json();
}

function renderPage() {
    document.getElementById("site-title").textContent = langData.title;
    document.getElementById("btn-lang").textContent =
        currentLang === "en" ? langData.button_switch_to_fi : langData.button_switch_to_en;
    document.getElementById("footer-text").textContent = langData.footer;

    const content = document.getElementById("content");
    content.innerHTML = "";
    theories.forEach(theory => {
        const card = document.createElement("div");
        card.className = "theory-card";
        const img = document.createElement("img");
        img.src = `assets/images/${theory.image}`;
        const h = document.createElement("h2");
        h.textContent = theory.title;
        const pDesc = document.createElement("p");
        pDesc.textContent = theory.description;
        const pFact = document.createElement("p");
        pFact.textContent = theory.facts;

        card.append(img, h, pDesc, pFact);
        content.append(card);
    });
}

document.getElementById("btn-lang").addEventListener("click", async () => {
    currentLang = currentLang === "en" ? "fi" : "en";
    await loadLang(currentLang);
    await loadTheories(currentLang);
    renderPage();
});

(async () => {
    await loadLang(currentLang);
    await loadTheories(currentLang);
    renderPage();
})();