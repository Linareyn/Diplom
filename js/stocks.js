const STOCKS_API = "https://oliver1ck.pythonanywhere.com/api/get_sales_list/";
const container = document.getElementById('stockList');

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

function createStockCard(stock) {
    const stockDiv = document.createElement('div');
    stockDiv.className = 'stock';

    const imageUrl = stock.image || './image/blackfriday.jpg';

    stockDiv.innerHTML = `
        <h3>${stock.title}</h3>
        <h4>Скидка ${stock.percent}%</h4>
        <img src="${imageUrl}" alt="${stock.title}" onerror="this.src='./image/blackfriday.jpg'">
        <p>Начало акции: ${formatDate(stock.start_sale)}</p>
        <p>Конец акции: ${formatDate(stock.stop_sale)}</p>
    `;
    return stockDiv;
}

function loadStocks() {
    fetch(STOCKS_API)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            const stocks = data.results || data;
            container.innerHTML = '';
            if (stocks.length === 0) {
                container.innerHTML = '<div class="no-stocks">Акций нет</div>';
                return;
            }
            stocks.forEach(stock => {
                container.appendChild(createStockCard(stock));
            });
        })
        .catch(err => {
            console.error('Ошибка загрузки акций:', err);
            container.innerHTML = '<div class="error">Не удалось загрузить акции</div>';
        });
}

document.addEventListener('DOMContentLoaded', loadStocks);