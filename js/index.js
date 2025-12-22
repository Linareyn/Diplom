document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

async function loadProducts() {
    try {
        console.log('Начинаю загрузку товаров...');
        
        const response = await fetch("https://oliver1ck.pythonanywhere.com/api/get_popular_products/");
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные получены:', data);
        
        // Находим контейнер для товаров
        const productsContainer = document.querySelector('.product');
        
        if (!productsContainer) {
            console.error('Контейнер .product не найден!');
            return;
        }
        
        // Проверяем, есть ли уже товары в контейнере
        const existingProducts = productsContainer.querySelectorAll('.cardProduct');
        console.log('Найдено существующих карточек:', existingProducts.length);
        
        // Если в контейнере уже есть статические товары, и мы хотим их заменить:
        // productsContainer.innerHTML = '';
        
        // Если хотим добавить к существующим - не очищаем
        
        // Создаем фрагмент для оптимизации
        const fragment = document.createDocumentFragment();
        
        // Обрабатываем каждый товар из API
        data.results.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            fragment.appendChild(productCard);
        });
        
        // Добавляем все товары в контейнер
        productsContainer.appendChild(fragment);
        
        console.log(`Добавлено ${data.results.length} товаров`);
        
        // Инициализируем обработчики событий
        initProductCardEvents();
        
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        showError('Не удалось загрузить товары. Попробуйте позже.');
    }
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'cardProduct cardProduct--white';
    card.dataset.id = product.id;
    card.dataset.index = index;
    
    // Проверяем наличие акции
    const hasSale = product.sale && product.sale.title && product.sale.title !== "Нет акции";
    
    // Создаем кнопки вариантов (объемов/веса)
    let variantsButtons = '';
    if (product.countitemproduct_set && product.countitemproduct_set.length > 0) {
        variantsButtons = product.countitemproduct_set.map(item => 
            `<button class="variant-btn">${item.value} ${item.unit}</button>`
        ).join('');
    } else {
        // Если вариантов нет, создаем одну стандартную кнопку
        variantsButtons = '<button class="variant-btn">1 шт.</button>';
    }
    
    // Обрезаем слишком длинные названия
    const title = product.title.length > 80 
        ? product.title.substring(0, 80) + '...' 
        : product.title;
    
    // Создаем HTML карточки (точно как в твоем шаблоне!)
    card.innerHTML = `
        ${hasSale ? '<div class="sale-label">Акция</div>' : ''}
        <div class="prevProduct">
            <img src="${product.image_prev || './image/пример.png'}" 
                 alt="${title}"
                 class="product-image"
                 onerror="this.src='./image/пример.png'">
            <h2>${title}</h2>
        </div>
        <div>
            ${variantsButtons}
        </div>
        <div class="priceBuy">
            <div class="priceCart">
                <span class="product-price">${product.price} BYN</span>
                <button class="cart add-to-cart-btn" data-id="${product.id}">
                    + <img src="./image/cart_major.png" alt="Корзина">
                </button>
            </div>
            <button class="buy1click one-click-btn" data-id="${product.id}">
                Купить в 1 клик
            </button>
        </div>
    `;
    
    return card;
}

function initProductCardEvents() {
    // Используем делегирование событий для динамических элементов
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // 1. Клик по кнопке выбора варианта (объема/веса)
        if (target.classList.contains('variant-btn') || target.closest('.variant-btn')) {
            const btn = target.classList.contains('variant-btn') 
                ? target 
                : target.closest('.variant-btn');
            
            const card = btn.closest('.cardProduct');
            
            // Убираем активный класс у всех кнопок в этой карточке
            card.querySelectorAll('.variant-btn').forEach(button => {
                button.classList.remove('active');
            });
            
            // Добавляем активный класс нажатой кнопке
            btn.classList.add('active');
            
            console.log('Выбран вариант:', btn.textContent, 'для товара ID:', card.dataset.id);
        }
        
        // 2. Клик по кнопке "В корзину"
        if (target.classList.contains('add-to-cart-btn') || target.closest('.add-to-cart-btn')) {
            const btn = target.classList.contains('add-to-cart-btn')
                ? target
                : target.closest('.add-to-cart-btn');
            
            const productId = btn.dataset.id;
            console.log('Добавить в корзину товар ID:', productId);
            event.preventDefault();
            
            // Здесь будет логика добавления в корзину
            addToCart(productId);
        }
        
        // 3. Клик по кнопке "Купить в 1 клик"
        if (target.classList.contains('one-click-btn') || target.closest('.one-click-btn')) {
            const btn = target.classList.contains('one-click-btn')
                ? target
                : target.closest('.one-click-btn');
            
            const productId = btn.dataset.id;
            console.log('Купить в 1 клик товар ID:', productId);
            event.preventDefault();
            
            // Здесь будет логика покупки в 1 клик
            buyOneClick(productId);
        }
    });
}

function addToCart(productId) {
    console.log('Товар добавлен в корзину:', productId);
    // Реализация добавления в корзину
}

function buyOneClick(productId) {
    console.log('Покупка в 1 клик:', productId);
    // Реализация покупки в 1 клик
}

function showError(message) {
    const container = document.querySelector('.product');
    if (!container) return;
    
    container.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: #e74c3c;
            background: #ffeaea;
            border-radius: 8px;
            margin: 20px;
        ">
            <p><strong>Ошибка:</strong> ${message}</p>
            <button onclick="location.reload()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">
                Обновить страницу
            </button>
        </div>
    `;
}