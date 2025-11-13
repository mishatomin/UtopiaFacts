const en = {
    title: "Utopia Facts",
    intro: "Welcome to Utopia Facts! Here we explore the most famous conspiracy theories and uncover the real truth behind them.",
    theoriesTitle: "Popular Theories",
    theory1Title: "Moon Landing Hoax",
    theory1Text: "Some believe the moon landing was staged — we explain why it’s real.",
    theory2Title: "Flat Earth Theory",
    theory2Text: "Flat Earth believers claim NASA lies — here’s what science says.",
    aboutTitle: "About the Project",
    aboutText: "This site was made for an IT project course. Inspired by the YouTube channel Utopia Show, it presents conspiracy theories and the facts that disprove them.",
    footerText: "© 2025 Utopia Facts | Made by Misha"
};

const fi = {
    title: "Utopia Facts",
    intro: "Tervetuloa Utopia Facts -sivustolle! Täällä tutkimme kuuluisimpia salaliittoteorioita ja paljastamme totuuden niiden takana.",
    theoriesTitle: "Suositut teoriat",
    theory1Title: "Kuulentohuijaus",
    theory1Text: "Jotkut uskovat, että kuulentoa ei koskaan tapahtunut — tässä on syyt, miksi se on totta.",
    theory2Title: "Litteä maa -teoria",
    theory2Text: "Litteän maan kannattajat väittävät, että NASA valehtelee — tässä on, mitä tiede sanoo.",
    aboutTitle: "Tietoa projektista",
    aboutText: "Tämä sivusto on tehty IT-projektikurssia varten. Se on saanut inspiraationsa YouTube-kanavalta Utopia Show ja esittelee salaliittoteorioita sekä niihin liittyviä faktoja.",
    footerText: "© 2025 Utopia Faktat | Tekijä: Misha"
};

function setLanguage(lang) {
    const dict = lang === "fi" ? fi : en;
    document.getElementById("title").textContent = dict.title;
    document.getElementById("intro-text").textContent = dict.intro;
    document.getElementById("theories-title").textContent = dict.theoriesTitle;
    document.getElementById("theory1-title").textContent = dict.theory1Title;
    document.getElementById("theory1-text").textContent = dict.theory1Text;
    document.getElementById("theory2-title").textContent = dict.theory2Title;
    document.getElementById("theory2-text").textContent = dict.theory2Text;
    document.getElementById("about-title").textContent = dict.aboutTitle;
    document.getElementById("about-text").textContent = dict.aboutText;
    document.getElementById("footer-text").textContent = dict.footerText;
}
async function loadData() {
    const lang = await fetch("data/lang_fi.json").then(r => r.json());
    const theories = await fetch("data/theories_fi.json").then(r => r.json());
    console.log(lang, theories);
}


document.getElementById("btn-en").addEventListener("click", () => setLanguage("en"));
document.getElementById("btn-fi").addEventListener("click", () => setLanguage("fi"));