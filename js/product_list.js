
const filterList = document.querySelector('.typeProduct ul');
fetch("https://oliver1ck.pythonanywhere.com/api/get_category_products_list/")
    .then(response => response.json())
    .then(data => {
        const categories = data.results || data;
        filterList.innerHTML = '';

        const tree = {};
        categories.forEach(cat => {
            const parentId = cat.parent || 0;
            if (!tree[parentId]) tree[parentId] = [];
            tree[parentId].push(cat);
        });
        const rootCategories = tree[0] || [];
        rootCategories.forEach(parentCat => {
            const li = document.createElement('li');
            li.innerHTML = `
        <label class="radio">
          <input type="radio" name="productType" value="${parentCat.id}">
          <div class="custom-radio"></div>
          <span>${parentCat.name}</span>
        </label>
      `;
            const children = tree[parentCat.id];
            if (children && children.length > 0) {
                const subUl = document.createElement('ul');
                subUl.className = 'food';

                children.forEach(child => {
                    const subLi = document.createElement('li');
                    subLi.innerHTML = `
            <label class="checkbox">
              <input type="checkbox" class="subcategory" data-parent="${parentCat.id}" value="${child.id}">
              <div class="custom-checkbox"></div>
              <span>${child.name}</span>
            </label>
          `;
                    subUl.appendChild(subLi);
                });

                li.appendChild(subUl);
            }

            filterList.appendChild(li);
        });
    })