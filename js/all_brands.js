let brandsContainer = document.querySelector(".brands ul"); 
fetch("https://oliver1ck.pythonanywhere.com/api/get_brands_list/")
.then(response => response.json())
.then(data => {
   
    brandsContainer.innerHTML = '';
    
    data.results.forEach(brand => {
        const li = document.createElement('li');
        const imgSrc = brand.image || './image/brand.png';
        li.innerHTML = `<img src="${imgSrc}" alt="${brand.name || 'brand'}">`;
        brandsContainer.appendChild(li);
    });
})