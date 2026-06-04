const PRODUCTS_API = "https://oliver1ck.pythonanywhere.com/api/get_products_list/";
const container = document.querySelector('.catalogList');

let allProducts = [];
let currentAnimal = 'Собаки';
let currentCategory = null;
let currentSort = 'new';

const sortFunctions = {
    'new': (a, b) => b.id - a.id,
    'A-Z': (a, b) => a.title.localeCompare(b.title),
    'Z-A': (a, b) => b.title.localeCompare(a.title),
    'price_asc': (a, b) => parseFloat(a.price) - parseFloat(b.price),
    'price_desc': (a, b) => parseFloat(b.price) - parseFloat(a.price),
    'popular': (a, b) => (b.sales_counter || 0) - (a.sales_counter || 0)
};

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = product.id;

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

    const title = product.title.length > 60 ? product.title.slice(0, 60) + '…' : product.title;
    const defaultPrice = product.countitemproduct_set?.[0]?.price || product.price;

    card.innerHTML = `
        ${hasSale ? '<div class="sale">Акция</div>' : ''}
        <img src="${product.image_prev || './image/пример.png'}" alt="${title}" class="imgCard" onerror="this.src='./image/пример.png'">
        <h3 class="product">${title}</h3>
        <div class="kg">${variantsHtml}</div>
        <div class="price">
            <p class="byn">${defaultPrice} BYN</p>
            <button class="cart add-to-cart" data-id="${product.id}">+<img src="./image/cart_major.png" alt="Корзина" class="imgCart"></button>
        </div>
        <button class="buy one-click-buy" data-id="${product.id}">Купить в 1 клик</button>
    `;

    const weightBtns = card.querySelectorAll('.btnKg');
    const weightOptions = Array.from(weightBtns).map(btn => ({
        weight: btn.innerText.trim(),
        price: parseFloat(btn.dataset.price) 
    }));
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
        const firstBtn = card.querySelector('.btnKg');
        if (firstBtn) {
            firstBtn.classList.add('active');
            const firstPrice = firstBtn.dataset.price;
            if (priceElement && firstPrice) {
                priceElement.textContent = parseFloat(firstPrice).toFixed(2) + ' BYN';
            }
        }
    }
    card.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart') || e.target.closest('.one-click-buy')) return;
        window.location.href = `./pageProduct.html?id=${product.id}`;
    });

    return card;
}

function filterByAnimal(products, animalType) {
    if (!animalType || animalType === 'all') return products;
    return products.filter(p => p.animal && p.animal.some(a => a.type === animalType));
}

function filterByCategory(products, categoryId) {
    if (!categoryId) return products;
    return products.filter(p => p.category && p.category.id == categoryId);
}

function applyAllFilters() {
    if (!allProducts.length) return;

    let filtered = filterByAnimal(allProducts, currentAnimal);
    filtered = filterByCategory(filtered, currentCategory);

    const sortFn = sortFunctions[currentSort];
    if (sortFn) filtered = [...filtered].sort(sortFn);

    renderProducts(filtered);
}

function renderProducts(products) {
    if (!container) return;
    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">Товаров не найдено</div>';
        return;
    }
    products.forEach(product => {
        container.appendChild(createProductCard(product));
    });
    bindCardButtons();
}

function loadProducts() {
    fetch(PRODUCTS_API)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            allProducts = data.results || data;
            console.log(`Загружено товаров: ${allProducts.length}`);
            applyAllFilters();
        })
        .catch(err => {
            console.error('Ошибка загрузки товаров:', err);
            if (container) container.innerHTML = '<div class="error">Не удалось загрузить товары</div>';
        });
}

function initAnimalTabs() {
    const tabs = document.querySelectorAll('.animalList li');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        const link = tab.querySelector('a');
        if (!link) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentAnimal = link.innerText.trim();
            applyAllFilters();
        });
    });
}


let categoryChildrenMap = {};

function loadCategoriesAndBuildFilter() {
    fetch("https://oliver1ck.pythonanywhere.com/api/get_category_products_list/")
        .then(res => res.json())
        .then(data => {
            const categories = data.results || data;
            categoryChildrenMap = {};
            categories.forEach(cat => {
                const parent = cat.parent || 0;
                if (!categoryChildrenMap[parent]) categoryChildrenMap[parent] = [];
                categoryChildrenMap[parent].push(cat.id);
            });
            const rootCategories = categories.filter(cat => !cat.parent || cat.parent === 0);
            const containerUl = document.querySelector('.typeProduct ul');
            if (!containerUl) return;
            containerUl.innerHTML = '';
            rootCategories.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <label class="radio">
                        <input type="radio" name="productType" value="${cat.id}">
                        <div class="custom-radio"></div>
                        <span>${cat.name}</span>
                    </label>
                `;
                containerUl.appendChild(li);
            });
            document.querySelectorAll('input[name="productType"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        currentCategory = e.target.value;
                        applyAllFilters();
                    }
                });
            });
        })
        .catch(err => console.error('Ошибка загрузки категорий:', err));
}

function filterByCategory(products, categoryId) {
    if (!categoryId) return products;
    let idsToMatch = [Number(categoryId)];
    if (categoryChildrenMap[categoryId]) {
        idsToMatch = idsToMatch.concat(categoryChildrenMap[categoryId]);
    }
    return products.filter(p => p.category && idsToMatch.includes(p.category.id));
}

function initCustomSelect() {
    const selectHeader = document.querySelector('.custom-select .select-header');
    const selectOptions = document.querySelector('.custom-select .select-options');
    const options = document.querySelectorAll('.custom-select .option');
    if (!selectHeader) return;

    selectHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOptions.classList.toggle('show');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.innerText;
            selectHeader.querySelector('span:first-child').innerText = text;
            currentSort = value;
            selectOptions.classList.remove('show');
            applyAllFilters();
        });
    });

    document.addEventListener('click', () => {
        selectOptions.classList.remove('show');
    });
}

function bindCardButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', handleAddToCart);
        btn.addEventListener('click', handleAddToCart);
    });
    document.querySelectorAll('.one-click-buy').forEach(btn => {
        btn.removeEventListener('click', handleBuyOneClick);
        btn.addEventListener('click', handleBuyOneClick);
    });
}

function handleAddToCart(e) {
    const button = e.currentTarget;
    const productId = button.dataset.id;
    const card = button.closest('.card');
    if (!card) return;

    const title = card.querySelector('.product')?.innerText.trim() || 'Товар';
    const priceElem = card.querySelector('.price .byn');
    let price = priceElem ? parseFloat(priceElem.innerText.replace(' BYN', '').replace(',', '.')) : 0;
    const image = card.querySelector('.imgCard')?.src || './image/пример.png';

    const activeWeightBtn = card.querySelector('.btnKg.active');
    let selectedWeight = null;
    if (activeWeightBtn) selectedWeight = activeWeightBtn.innerText.trim();
    else {
        const firstWeight = card.querySelector('.btnKg');
        if (firstWeight) selectedWeight = firstWeight.innerText.trim();
    }

    const weightBtns = card.querySelectorAll('.btnKg');
    const weightOptions = Array.from(weightBtns).map(btn => ({
        weight: btn.innerText.trim(),
        price: parseFloat(btn.dataset.price.replace(',', '.'))
    }));

    const uniqueId = selectedWeight ? `${productId}_${selectedWeight}` : productId;
    const quantity = 1;

    if (window.cart && typeof window.cart.add === 'function') {
        window.cart.add({
            id: uniqueId,
            name: title,
            price: price,
            weight: selectedWeight,
            weightOptions: weightOptions,
            image: image,
            quantity: quantity
        });
        showNotification(`${title} добавлен в корзину`);
    }
}


function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = ' rgb(0, 160, 172)';
    notif.style.color = 'white';
    notif.style.padding = '12px 20px';
    notif.style.borderRadius = '8px';
    notif.style.zIndex = '9999';
    notif.style.fontFamily = 'SF Pro Text';
    notif.style.fontSize = '14px';
    notif.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

function handleBuyOneClick(e) {
    const productId = e.currentTarget.dataset.id;
    console.log('Купить в 1 клик ID:', productId);
    alert('Открыть форму быстрого заказа (заглушка)');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!container) console.error('Контейнер .catalogList не найден');
    loadProducts();
    initAnimalTabs();
    loadCategoriesAndBuildFilter();
    initCustomSelect();
});