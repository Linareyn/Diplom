const API_BASE = 'https://oliver1ck.pythonanywhere.com/api/get_articles_list/';

function safeString(value) {
    if (value === undefined || value === null) return '';
    return String(value);
}

function escapeHtml(str) {
    const s = safeString(str);
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


function formatArticleText(htmlString) {
    return safeString(htmlString);
}

async function fetchAllArticles() {
    let allArticles = [];
    let nextUrl = API_BASE;

    while (nextUrl) {
        try {
            const response = await fetch(nextUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            allArticles = allArticles.concat(data.results);
            nextUrl = data.next;
        } catch (err) {
            console.error('Ошибка загрузки списка статей:', err);
            throw err;
        }
    }
    return allArticles;
}

async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const container = document.getElementById('articleDetail');

    if (!articleId) {
        container.innerHTML = '<div class="error">❌ ID статьи не указан. <a href="article.html">Вернуться к списку</a></div>';
        return;
    }

    container.innerHTML = '<div class="loading">Загрузка статьи...</div>';

    try {
        const allArticles = await fetchAllArticles();
        const article = allArticles.find(a => a.id == articleId);

        if (!article) {
            container.innerHTML = `<div class="error">⚠️ Статья с ID=${articleId} не найдена. <a href="article.html">Вернуться к списку</a></div>`;
            return;
        }

        const title = safeString(article.title);
        const image = article.image || '';
        const readTime = safeString(article.read_time);
        const date = formatDate(article.date_create);
        const animal = article.animal ? safeString(article.animal) : '';
        const text = safeString(article.text);

        container.innerHTML = `
            <div class="article-detail">
                <h1>${escapeHtml(title)}</h1>
                ${image ? `<img src="${image}" alt="${escapeHtml(title)}" class="detail-img">` : ''}
                <div class="meta">
                <div class="time">
                    <img src="./image/clock_minor.png" alt=""> <span> ${readTime || '0 мин.'}</span>
                    </div>
                    <div class="date">
                    <img src="./image/calendar.png" alt=""><span> ${date}</span>  
                    </div>
                </div>
                <div class="full-text">${formatArticleText(text)}</div>
                <a href="article.html" class="back-link">← Назад к списку</a>
            </div>
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="error">Ошибка загрузки статей. Проверьте соединение или попробуйте позже.</div>';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('ru-RU');
}

document.addEventListener('DOMContentLoaded', loadArticle);