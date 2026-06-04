document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
        const container = document.querySelector('.productAll');
        if (container) container.innerHTML = '<p style="color:red;">Товар не указан. Вернитесь в <a href="./catalog.html">каталог</a>.</p>';
        return;
    }

    let product = null;
    try {
        const response = await fetch('https://oliver1ck.pythonanywhere.com/api/get_products_list/');
        if (!response.ok) throw new Error('Ошибка загрузки списка товаров: ' + response.status);
        const data = await response.json();

        let products = [];
        if (Array.isArray(data)) {
            products = data;
        } else if (data.results && Array.isArray(data.results)) {
            products = data.results;
        } else if (data.products && Array.isArray(data.products)) {
            products = data.products;
        } else {
            console.error('Неизвестная структура ответа:', data);
            throw new Error('Не удалось получить список товаров');
        }

        console.log(`Загружено товаров: ${products.length}`);
        console.log(`Ищем товар с ID = ${productId} (тип: ${typeof productId})`);

        product = products.find(p => String(p.id) === String(productId));
        console.log('Найденный товар:', product);

        if (!product) {
            throw new Error(`Товар с ID ${productId} не найден в списке`);
        }
    } catch (err) {
        console.error('Ошибка в pageProduct.js:', err);
        const container = document.querySelector('.productAll');
        if (container) {
            container.innerHTML = `
            <p style="color:red; text-align:center; padding:50px;">
                Товар не найден. Возможно, он был удалён.<br>
                Через 3 секунды вы вернётесь в <a href="./catalog.html">каталог</a>.
            </p>
        `;
            setTimeout(() => {
                window.location.href = './catalog.html';
            }, 3000);
        }
        return;
    }

    const nameElem = document.querySelector('.nameProduct h1');
    if (nameElem) nameElem.textContent = product.title;

    const brandLink = document.querySelector('.nameProduct a');
    if (brandLink && product.brand) {
        brandLink.textContent = `Смотреть все товары бренда ${product.brand.name}`;
        brandLink.href = `./catalog.html?brand=${product.brand.id}`;
    } else if (brandLink) {
        brandLink.style.display = 'none';
    }

    const mainImg = document.querySelector('.mainImg img');
    if (mainImg && product.image_prev) mainImg.src = product.image_prev;

    const frame = document.querySelector('.frame');
if (frame) {
    if (product.images && product.images.length) {
        frame.innerHTML = '';
        product.images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img.image;
            imgEl.alt = product.title;
            frame.appendChild(imgEl);
        });
    } else if (product.image_prev) {
        frame.innerHTML = '';
        for (let i = 0; i < 1; i++) {
            const imgEl = document.createElement('img');
            imgEl.src = product.image_prev;
            imgEl.alt = product.title;
            frame.appendChild(imgEl);
        }
    } else {
        frame.style.display = 'none';
    }
}

    const descBlock = document.querySelector('.about-feed p');
    if (descBlock) {
        if (product.description) descBlock.textContent = product.description;
        else descBlock.closest('.description')?.remove();
    }

    const featuresList = document.querySelector('.peculiarities ul');
    if (featuresList && product.key_features) {
        let featuresHtml = '';
        if (product.key_features.includes('<li>')) {
            featuresHtml = product.key_features;
        } else {
            const lines = product.key_features.split(/\r?\n/).filter(l => l.trim());
            featuresHtml = lines.map(line => `<li>${line.trim()}</li>`).join('');
        }
        featuresList.innerHTML = featuresHtml;
    } else if (featuresList) {
        featuresList.closest('.peculiarities')?.remove();
    }

    const compoundBlock = document.querySelector('.composition p');
    if (compoundBlock) {
        if (product.compound) compoundBlock.textContent = product.compound;
        else compoundBlock.closest('.composition')?.remove();
    }

    const analysisList = document.querySelector('.analysis ul');
    if (analysisList && product.guaranteed_analysis) {
        let analysisHtml = '';
        if (product.guaranteed_analysis.includes('<li>')) {
            analysisHtml = product.guaranteed_analysis;
        } else {
            const lines = product.guaranteed_analysis.split(/\r?\n/).filter(l => l.trim());
            analysisHtml = lines.map(line => `<li>${line.trim()}</li>`).join('');
        }
        analysisList.innerHTML = analysisHtml;
    } else if (analysisList) {
        analysisList.closest('.analysis')?.remove();
    }

    const additivesBlock = document.querySelector('.additives p');
    if (additivesBlock) {
        if (product.nutritional_supplements) additivesBlock.textContent = product.nutritional_supplements;
        else additivesBlock.closest('.additives')?.remove();
    }

    const weightContainer = document.querySelector('.weightPrice');
    const totalPriceSpan = document.querySelector('.price_weight span');
    const totalWeightSpan = document.querySelector('.price_weight p');
    let currentWeight = null;
    let currentPrice = 0;
    let weightOptions = [];

    if (weightContainer) weightContainer.innerHTML = '';

    if (product.countitemproduct_set && product.countitemproduct_set.length) {
        product.countitemproduct_set.forEach(item => {
            const basePrice = parseFloat(product.price);
            const priceForWeight = (basePrice * (item.percent / 100)).toFixed(2);
            const btn = document.createElement('button');
            btn.className = 'weight-btn';
            btn.setAttribute('data-weight', item.value);
            btn.setAttribute('data-price', priceForWeight);
            btn.innerHTML = `<span class="weight">${item.value} ${item.unit}</span><span class="price">${priceForWeight} BYN</span>`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.weightPrice button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentWeight = `${item.value} ${item.unit}`;
                currentPrice = parseFloat(priceForWeight);
                if (totalPriceSpan) totalPriceSpan.textContent = currentPrice.toFixed(2) + ' BYN';
                if (totalWeightSpan) totalWeightSpan.textContent = `Общий вес: ${item.value} ${item.unit}`;
            });
            weightContainer.appendChild(btn);
            weightOptions.push({
                weight: `${item.value} ${item.unit}`,
                price: parseFloat(priceForWeight)
            });
        });
        const firstBtn = weightContainer.querySelector('button');
        if (firstBtn) firstBtn.click();
    } else {
        const btn = document.createElement('button');
        btn.className = 'weight-btn active';
        btn.setAttribute('data-weight', '1 шт.');
        btn.setAttribute('data-price', product.price);
        btn.innerHTML = `<span class="weight">1 шт.</span><span class="price">${product.price} BYN</span>`;
        weightContainer.appendChild(btn);
        currentWeight = '1 шт.';
        currentPrice = parseFloat(product.price);
        if (totalPriceSpan) totalPriceSpan.textContent = currentPrice.toFixed(2) + ' BYN';
        if (totalWeightSpan) totalWeightSpan.textContent = 'Общий вес: 1 шт.';
        weightOptions.push({ weight: '1 шт.', price: parseFloat(product.price) });
    }

    const setWeightLink = document.querySelector('.info-weight p');
    const chooseWeightBlock = document.querySelector('.chooseWeight');
    const weightInput = document.querySelector('.chooseWeight input');
    const applyWeightBtn = document.querySelector('.chooseWeight button');

    if (setWeightLink && chooseWeightBlock) {
        setWeightLink.addEventListener('click', () => {
            chooseWeightBlock.classList.toggle('chooseWeight-active');
        });
    }

    if (applyWeightBtn && weightInput) {
        applyWeightBtn.addEventListener('click', () => {
            let inputVal = weightInput.value.trim();
            if (!inputVal) return;
            let weightKg = parseFloat(inputVal.replace(',', '.').replace(/[^0-9.]/g, ''));
            if (isNaN(weightKg) || weightKg <= 0) {
                alert('Введите корректный вес (например: 1.2)');
                return;
            }
            const activeBtn = document.querySelector('.weightPrice .active');
            let basePricePerKg = currentPrice / parseFloat(currentWeight.split(' ')[0].replace(',', '.'));
            if (activeBtn) {
                const activeWeightStr = activeBtn.querySelector('.weight')?.innerText;
                const activePrice = parseFloat(activeBtn.dataset.price);
                const activeWeightNum = parseFloat(activeWeightStr?.split(' ')[0].replace(',', '.'));
                if (!isNaN(activeWeightNum) && activeWeightNum > 0) {
                    basePricePerKg = activePrice / activeWeightNum;
                }
            }
            let newPrice = basePricePerKg * weightKg;
            currentWeight = weightKg.toFixed(3).replace(/\.?0+$/, '') + ' кг';
            currentPrice = newPrice;
            if (totalPriceSpan) totalPriceSpan.textContent = currentPrice.toFixed(2) + ' BYN';
            if (totalWeightSpan) totalWeightSpan.textContent = `Общий вес: ${currentWeight}`;
            document.querySelectorAll('.weightPrice button').forEach(b => b.classList.remove('active'));
            chooseWeightBlock.classList.remove('chooseWeight-active');
        });
    }

    const addToCartBtn = document.querySelector('.add-cart');
    const quantityInput = document.querySelector('.amount input');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            let quantity = 1;
            if (quantityInput) {
                quantity = parseInt(quantityInput.value);
                if (isNaN(quantity) || quantity < 1) quantity = 1;
            }
            const selectedWeight = currentWeight;
            const price = currentPrice;
            const image = product.image_prev || './image/пример.png';
            const uniqueId = selectedWeight ? `${product.id}_${selectedWeight}` : `${product.id}`;

            const cartItem = {
                id: uniqueId,
                name: product.title,
                price: price,
                weight: selectedWeight,
                weightOptions: weightOptions,
                image: image,
                quantity: quantity
            };

            if (window.cart && window.cart.add) {
                window.cart.add(cartItem);
                alert('Товар добавлен в корзину');
            } else {
                alert('Корзина не инициализирована');
            }
        });
    }

    const minusBtn = document.querySelector('.amount .add:first-child');
    const plusBtn = document.querySelector('.amount .add:last-child');
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value) || 1;
            if (val > 1) quantityInput.value = val - 1;
        });
        plusBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value) || 1;
            quantityInput.value = val + 1;
        });
    }
});