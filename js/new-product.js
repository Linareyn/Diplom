const NEW_API = "https://oliver1ck.pythonanywhere.com/api/get_new_products/";
const containerN = document.querySelector('.New_product');

function createNewCard(product) {
    const div = document.createElement('div');
    div.classList.add('cardN');
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

    // Логика выбора веса (активная кнопка)
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

function updateCardDataN() {
    // Кнопки «В корзину» в новых товарах
    document.querySelectorAll('.New_product .add-to-cart').forEach(btn => {
        btn.removeEventListener('click', handleNewAddToCart);
        btn.addEventListener('click', handleNewAddToCart);
    });
    // Кнопки «Купить в 1 клик»
    document.querySelectorAll('.New_product .one-click-buy').forEach(btn => {
        btn.removeEventListener('click', handleNewOneClick);
        btn.addEventListener('click', handleNewOneClick);
    });
}

function handleNewAddToCart(e) {
    const btn = e.currentTarget;
    const productId = btn.dataset.id;
    const card = btn.closest('.cardN');
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
        showNotificationN(`${title} добавлен в корзину`);
    } else {
        console.warn('Корзина не инициализирована (загрузите cart.js)');
        alert('Товар добавлен в корзину (заглушка)');
    }
}

function handleNewOneClick(e) {
    const productId = e.currentTarget.dataset.id;
    console.log('Купить в 1 клик (новинка) ID:', productId);
    alert('Форма быстрого заказа будет здесь');
}

function showNotificationN(message) {
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

// Загрузка новых товаров
fetch(NEW_API)
    .then(response => response.json())
    .then(data => {
        if (!containerN) {
            console.warn('Контейнер .New_product не найден на этой странице');
            return;
        }
        containerN.innerHTML = '';
        const products = data.results || data;
        products.forEach(product => {
            containerN.appendChild(createNewCard(product));
        });
        updateCardDataN(); // теперь функция существует
    })
    .catch(err => console.error('Ошибка загрузки новых товаров:', err));