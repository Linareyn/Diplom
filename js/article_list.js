const ARTICLES_API = "https://oliver1ck.pythonanywhere.com/api/get_articles_slider/";
const container = document.querySelector('.list-article');
const loadMoreBtn = document.querySelector('.button_more button');

let currentPageUrl = ARTICLES_API;
let isLoading = false;

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}

function createArticleCard(article) {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'article';
    articleDiv.dataset.id = article.id;
    articleDiv.style.cursor = 'pointer';
    const imgSrc = article.image || './image/пример_Статья.png';
    const shortText = (article.text || '').length > 150 ? article.text.slice(0, 150) + '…' : article.text;
    articleDiv.innerHTML = `
        <img src="${imgSrc}" alt="${article.title || ''}" onerror="this.src='./image/пример_Статья.png'">
        <div class="articalText">
            <h3>${article.title || ''}</h3>
            <p>${shortText}</p>
        </div>
        <div class="readTime">
            <div><img src="./image/clock_minor.png" alt=""><p>Время чтения: ${article.read_time || 0} мин.</p></div>
            <div><img src="./image/calendar.png" alt=""><p>${formatDate(article.date_create)}</p></div>
        </div>
    `;
    articleDiv.addEventListener('click', () => {
        window.location.href = `./article-details.html?id=${article.id}`;
    });
    return articleDiv;
}

function renderArticles(articles) {
    articles.forEach(article => container.appendChild(createArticleCard(article)));
}

async function fetchArticles(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { articles: data.results || data, next: data.next };
}

async function initArticles() {
    container.innerHTML = '';
    isLoading = true;
    try {
        const { articles, next } = await fetchArticles(ARTICLES_API);
        renderArticles(articles);
        currentPageUrl = next;
        if (loadMoreBtn) loadMoreBtn.style.display = next ? 'block' : 'none';
    } catch (err) {
        console.error('Ошибка загрузки статей:', err);
        container.innerHTML = '<div class="error">Не удалось загрузить статьи</div>';
    } finally {
        isLoading = false;
    }
}

async function loadMore() {
    if (isLoading || !currentPageUrl) return;
    isLoading = true;
    loadMoreBtn.textContent = 'Загрузка...';
    try {
        const { articles, next } = await fetchArticles(currentPageUrl);
        renderArticles(articles);
        currentPageUrl = next;
        if (!next) loadMoreBtn.style.display = 'none';
    } catch (err) {
        console.error('Ошибка подгрузки:', err);
    } finally {
        isLoading = false;
        loadMoreBtn.textContent = 'Показать ещё';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initArticles();
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMore);
});