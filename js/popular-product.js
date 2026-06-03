const POPULAR_API = "https://oliver1ck.pythonanywhere.com/api/get_popular_products/";
const container = document.querySelector('.Popular_Product');

function createPopularCard(product) {
    const div = document.createElement('div');
    div.classList.add('card');
    const hasSale = product.sale && product.sale.title !== "Нет акции";

    let variantsHtml = '';
    if (product.countitemproduct_set && product.countitemproduct_set.length) {
        variantsHtml = product.countitemproduct_set.map(item =>
            `<button class="btnKg">${item.value} ${item.unit}</button>`
        ).join('');
    } else {
        variantsHtml = '<button class="btnKg">1 шт.</button>';
    }

    div.innerHTML = `
        ${hasSale ? '<div class="sale">Акция</div>' : ''}
        <img src="${product.image_prev || './image/пример.png'}" alt="${product.title}" class="imgCard" onerror="this.src='./image/пример.png'">
        <h3 class="product">${product.title}</h3>
        <div class="kg">${variantsHtml}</div>
        <div class="price">
            <p class="byn">${product.price} BYN</p>
            <button class="cart add-to-cart" data-id="${product.id}">+<img src="./image/cart_major.png" alt="Корзина" class="imgCart"></button>
        </div>
        <button class="buy one-click-buy" data-id="${product.id}">Купить в 1 клик</button>
    `;

    // Логика выбора веса
    const weightBtns = div.querySelectorAll('.btnKg');
    weightBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            weightBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    return div;
}

function updateCardData() {
    // Привязываем кнопки «В корзину»
    document.querySelectorAll('.Popular_Product .add-to-cart').forEach(btn => {
        btn.removeEventListener('click', handlePopularAddToCart);
        btn.addEventListener('click', handlePopularAddToCart);
    });
    // Привязываем кнопки «Купить в 1 клик» (заглушка)
    document.querySelectorAll('.Popular_Product .one-click-buy').forEach(btn => {
        btn.removeEventListener('click', handlePopularOneClick);
        btn.addEventListener('click', handlePopularOneClick);
    });
}

function handlePopularAddToCart(e) {
    const btn = e.currentTarget;
    const productId = btn.dataset.id;
    const card = btn.closest('.card');
    if (!card) return;

    const title = card.querySelector('.product')?.innerText.trim() || 'Товар';
    const priceElem = card.querySelector('.price .byn');
    const price = priceElem ? parseFloat(priceElem.innerText.replace(',', '.')) : 0;
    const image = card.querySelector('.imgCard')?.src || './image/пример.png';
    
    let weight = null;
    const activeWeight = card.querySelector('.btnKg.active');
    if (activeWeight) {
        weight = activeWeight.innerText.trim();
    } else {
        const firstWeight = card.querySelector('.btnKg');
        if (firstWeight) weight = firstWeight.innerText.trim();
    }

    const uniqueId = weight ? `${productId}_${weight}` : productId;
    const quantity = 1;

    if (window.cart && typeof window.cart.add === 'function') {
        window.cart.add({
            id: uniqueId,
            name: title,
            price: price,
            weight: weight,
            image: image,
            quantity: quantity
        });
        showNotification(`${title} добавлен в корзину`);
    } else {
        console.warn('Корзина не инициализирована');
        alert('Товар добавлен в корзину (заглушка)');
    }
}

function handlePopularOneClick(e) {
    const productId = e.currentTarget.dataset.id;
    console.log('Купить в 1 клик (популярный) ID:', productId);
    alert('Форма быстрого заказа будет здесь');
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#4CAF50';
    notif.style.color = 'white';
    notif.style.padding = '12px 20px';
    notif.style.borderRadius = '8px';
    notif.style.zIndex = '9999';
    notif.style.fontSize = '14px';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Загрузка популярных товаров
fetch(POPULAR_API)
    .then(response => response.json())
    .then(data => {
        if (!container) return;
        container.innerHTML = '';
        const products = data.results || data;
        products.forEach(product => {
            container.appendChild(createPopularCard(product));
        });
        updateCardData(); // теперь функция существует
    })
    .catch(err => console.error('Ошибка загрузки популярных товаров:', err));