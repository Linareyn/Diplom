const brandsList = document.querySelector('.brands ul');

fetch("https://oliver1ck.pythonanywhere.com/api/get_brands_list/")
    .then(response => response.json())
    .then(data => {
        const brandsList = document.querySelector('.brands ul');
        brandsList.innerHTML = '';

        const brandsToShow = (data.results || data).slice(0, 12);

        brandsToShow.forEach(brand => {
            const li = document.createElement('li');
            const imgSrc = brand.image || './image/brand.png';
            li.innerHTML = `<img src="${imgSrc}" alt="${brand.name || 'Бренд'}">`;
            brandsList.appendChild(li);
        });
    })
