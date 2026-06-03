const CART_STORAGE_KEY = 'territory_zoo_cart';

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCounter();
    return cart;
}

function addToCart(product) {
    let cart = getCart();
    if (!product.weightOptions) product.weightOptions = [];
    const existingIndex = cart.findIndex(item => item.id === product.id && item.weight === (product.weight || ''));
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push({ ...product });
    }
    saveCart(cart);
    return cart;
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    return cart;
}

function updateQuantity(index, newQuantity) {
    let cart = getCart();
    if (newQuantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQuantity;
    }
    saveCart(cart);
    return cart;
}

function getTotalItems() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalPrice() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return Math.round(total * 100) / 100;
}

function updateCartCounter() {
    const totalItems = getTotalItems();
    const cartLink = document.querySelector('.cart');
    if (cartLink) {
        let countSpan = cartLink.querySelector('.cart-count');
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'cart-count';
            cartLink.appendChild(countSpan);
        }
        countSpan.textContent = totalItems;
        countSpan.style.fontFamily = 'SF Pro Text';
        countSpan.style.fontSize = '14px';
        countSpan.style.color = 'black';
        countSpan.style.marginLeft = '5px';
    }
}

function handleWeightChange(e) {
    const btn = e.currentTarget;
    const newWeight = btn.dataset.weight;
    const newPrice = parseFloat(btn.dataset.price);
    const productDiv = btn.closest('.buy-product');
    if (!productDiv) return;
    const index = productDiv.dataset.cartIndex;
    if (index === undefined) return;
    if (isNaN(newPrice)) {
        console.warn('Цена не число:', btn.dataset.price);
        return;
    }
    let cart = getCart();
    if (cart[index]) {
        cart[index].weight = newWeight;
        cart[index].price = newPrice;
        saveCart(cart);
        renderCart(); // перерисовываем
    }
}

function renderCart() {
    const container = document.querySelector('.shoping-list .frame-shoping');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Корзина пуста. <a href="./catalog.html">Перейти в каталог</a></div>';
        const priceH2 = document.querySelector('.place-order .price-quantity h2');
        const itemsP = document.querySelector('.place-order .price-quantity p');
        if (priceH2) priceH2.textContent = '0 BYN';
        if (itemsP) itemsP.textContent = '0 товаров';
        return;
    }

    let html = '';
    cart.forEach((item, idx) => {
        const weightOptions = Array.isArray(item.weightOptions) ? item.weightOptions : [];
        html += `
            <div class="buy-product" data-cart-index="${idx}">
                <img src="${item.image || './image/product/default.png'}" alt="${escapeHtml(item.name)}" class="img-product">
                <div class="name-product">
                    <h3>${escapeHtml(item.name)}</h3>
                    <div class="weight-options-list">
                        ${weightOptions.map(opt => `
                            <button class="weight-option ${opt.weight === item.weight ? 'active' : ''}" 
                                    data-weight="${escapeHtml(opt.weight)}" data-price="${opt.price}">
                                ${escapeHtml(opt.weight)}
                            </button>
                        `).join('')}
                    </div>
                    <p class="set-weight">Указать свой вес</p>
                </div>
                <div class="quantity">
                    <div class="amount">
                        <button class="decrease-qty">-</button>
                        <input type="text" value="${item.quantity}" class="qty-input">
                        <button class="increase-qty">+</button>
                        <img src="./image/Delete.png" alt="Удалить" class="delete-item">
                    </div>
                    <div>
                        <p>${item.price.toFixed(2)} BYN</p>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();
    const priceBlock = document.querySelector('.place-order .price-quantity h2');
    const itemsBlock = document.querySelector('.place-order .price-quantity p');
    if (priceBlock) priceBlock.textContent = `${totalPrice.toFixed(2)} BYN`;
    if (itemsBlock) itemsBlock.textContent = `${totalItems} ${declOfNum(totalItems, ['товар', 'товара', 'товаров'])}`;

    // Обработчики
    document.querySelectorAll('.weight-option').forEach(btn => {
        btn.removeEventListener('click', handleWeightChange);
        btn.addEventListener('click', handleWeightChange);
    });
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.onclick = () => {
            const wrapper = btn.closest('.buy-product');
            const idx = wrapper.dataset.cartIndex;
            const input = wrapper.querySelector('.qty-input');
            let val = parseInt(input.value) || 1;
            if (val > 1) updateQuantity(idx, val - 1);
            else removeFromCart(idx);
            renderCart();
        };
    });
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.onclick = () => {
            const wrapper = btn.closest('.buy-product');
            const idx = wrapper.dataset.cartIndex;
            const input = wrapper.querySelector('.qty-input');
            let val = parseInt(input.value) || 1;
            updateQuantity(idx, val + 1);
            renderCart();
        };
    });
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.onclick = () => {
            const wrapper = btn.closest('.buy-product');
            const idx = wrapper.dataset.cartIndex;
            removeFromCart(idx);
            renderCart();
        };
    });
    document.querySelectorAll('.qty-input').forEach(input => {
        input.onchange = () => {
            const wrapper = input.closest('.buy-product');
            const idx = wrapper.dataset.cartIndex;
            let val = parseInt(input.value) || 1;
            if (val < 1) val = 1;
            updateQuantity(idx, val);
            renderCart();
        };
    });
}

function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.cart = {
    add: addToCart,
    get: getCart,
    remove: removeFromCart,
    update: updateQuantity,
    totalItems: getTotalItems,
    totalPrice: getTotalPrice,
    render: renderCart,
    updateCounter: updateCartCounter
};

document.addEventListener('DOMContentLoaded', () => {
    window.cart.updateCounter();
});