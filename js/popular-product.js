const POPULAR_API = "https://oliver1ck.pythonanywhere.com/api/get_popular_products/";
const popularContainer = document.querySelector('.Popular_Product');

function createPopularCard(product) {
    const card = document.createElement('div');
    card.classList.add('card');
    const hasSale = product.sale && product.sale.title !== "Нет акции";

    let variantsHtml = '';
    if (product.countitemproduct_set && product.countitemproduct_set.length) {
        variantsHtml = product.countitemproduct_set.map(item => {
            const basePrice = parseFloat(product.price);
            const priceForWeight = (basePrice * (item.percent / 100)).toFixed(2);
            return `<button class="btnKg" data-weight="${item.value}" data-price="${priceForWeight}" data-unit="${item.unit}">${item.value} ${item.unit}</button>`;
        }).join('');
    } else {
        variantsHtml = `<button class="btnKg" data-weight="1" data-price="${product.price}" data-unit="шт.">1 шт.</button>`;
    }

    card.innerHTML = `
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

    const weightBtns = card.querySelectorAll('.btnKg');
    const priceElement = card.querySelector('.price .byn');

    weightBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            weightBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const newPrice = btn.dataset.price;
            if (priceElement && newPrice) {
                priceElement.textContent = parseFloat(newPrice).toFixed(2) + ' BYN';
            }
        });
    });
    if (!card.querySelector('.btnKg.active')) {
        const first = weightBtns[0];
        if (first) {
            first.classList.add('active');
            const firstPrice = first.dataset.price;
            if (priceElement && firstPrice) {
                priceElement.textContent = parseFloat(firstPrice).toFixed(2) + ' BYN';
            }
        }
    }

    card.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart') || e.target.closest('.one-click-buy')) return;
        window.location.href = `./pageProduct.html?id=${product.id}`;
    });
    card.style.cursor = 'pointer';

    return card;
}

function attachCartEvents() {
    document.querySelectorAll('.Popular_Product .add-to-cart').forEach(btn => {
        btn.removeEventListener('click', handlePopularAdd);
        btn.addEventListener('click', handlePopularAdd);
    });
    document.querySelectorAll('.Popular_Product .one-click-buy').forEach(btn => {
        btn.removeEventListener('click', handleOneClickStub);
        btn.addEventListener('click', handleOneClickStub);
    });
}

function handleOneClickStub() {
    alert('Заглушка 1 клик');
}

function handlePopularAdd(e) {
    const btn = e.currentTarget;
    const productId = btn.dataset.id;
    const card = btn.closest('.card');
    if (!card) return;

    const title = card.querySelector('.product')?.innerText.trim() || 'Товар';
    const priceElem = card.querySelector('.price .byn');
    let price = priceElem ? parseFloat(priceElem.innerText.replace(' BYN', '').replace(',', '.')) : 0;
    const image = card.querySelector('.imgCard')?.src || './image/пример.png';

    const activeWeight = card.querySelector('.btnKg.active');
    let selectedWeight = activeWeight ? activeWeight.innerText.trim() : card.querySelector('.btnKg')?.innerText.trim();

    const weightBtns = card.querySelectorAll('.btnKg');
    const weightOptions = Array.from(weightBtns).map(btn => ({
        weight: btn.innerText.trim(),
        price: parseFloat(btn.dataset.price)
    }));

    const uniqueId = selectedWeight ? `${productId}_${selectedWeight}` : productId;
    if (window.cart && window.cart.add) {
        window.cart.add({
            id: uniqueId,
            name: title,
            price: price,
            weight: selectedWeight,
            weightOptions: weightOptions,
            image: image,
            quantity: 1
        });
        showNotification(`${title} добавлен в корзину`);
    } else {
        alert('Товар добавлен в корзину (заглушка)');
    }
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#008060; color:#fff; padding:12px 20px; border-radius:8px; z-index:9999;';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

fetch(POPULAR_API)
    .then(res => res.json())
    .then(data => {
        if (!popularContainer) return;
        popularContainer.innerHTML = '';
        const products = data.results || data;
        products.forEach(product => {
            popularContainer.appendChild(createPopularCard(product));
        });
        attachCartEvents();
        if (typeof initPopularSlider === 'function') initPopularSlider();
    })
    .catch(err => console.error('Ошибка загрузки популярных:', err));