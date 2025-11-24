let currentLang = 'en';
let langData = {};
let theories = [];

// Загрузка JSON данных
async function loadLangData() {
  const resp = await fetch(`data/lang_${currentLang}.json`);
  langData = await resp.json();
}

async function loadTheories() {
  const resp = await fetch(`data/theories_${currentLang}.json`);
  theories = await resp.json();
}

// Рендер страницы
function renderPage() {
  document.getElementById('site-title').textContent = langData.title;
  document.getElementById('footer-text').textContent = langData.footer;

  const content = document.getElementById('content');
  content.innerHTML = '';

  theories.forEach(t => {
    const card = document.createElement('div');
    card.className = 'theory-card';

    const title = document.createElement('h2');
    title.textContent = t.title;

    const short = document.createElement('p');
    short.textContent = t.short;

    card.appendChild(title);
    card.appendChild(short);

    // Подробный текст
    if (t.content && Array.isArray(t.content)) {
      t.content.forEach(block => {
        const p = document.createElement('p');
        p.textContent = block.text;
        card.appendChild(p);
      });
    }

    content.appendChild(card);
  });
}

// Переключение языка
document.getElementById('btn-en').addEventListener('click', async () => {
  currentLang = 'en';
  await loadLangData();
  await loadTheories();
  renderPage();
});

document.getElementById('btn-fi').addEventListener('click', async () => {
  currentLang = 'fi';
  await loadLangData();
  await loadTheories();
  renderPage();
});

// Инициализация
(async () => {
  await loadLangData();
  await loadTheories();
  renderPage();
})();
