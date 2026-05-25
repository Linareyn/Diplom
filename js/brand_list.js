const brandsList = document.querySelector('.byBrands ul');

fetch("https://oliver1ck.pythonanywhere.com/api/get_brands_list/")
    .then(response => response.json())
    .then(data => {
        brandsList.innerHTML = '';

        const brands = data.results || data;

        brands.forEach(brand => {
            const li = document.createElement('li');

            const brandName = brand.name || brand.title || 'Бренд';

            li.innerHTML = `
        <label class="checkbox">
          <input type="checkbox" class="brand-checkbox" value="${brand.id || brandName}">
          <div class="custom-checkbox"></div>
          <span>${brandName}</span>
        </label>
      `;

            brandsList.appendChild(li);
        });

        initBrandSearch();
    })
    
function initBrandSearch() {
    const searchInput = document.querySelector('.searchBrandInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', function (e) {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.byBrands ul li').forEach(li => {
            const span = li.querySelector('span');
            if (span) {
                li.style.display = span.textContent.toLowerCase().includes(term) ? '' : 'none';
            }
        });
    });
}