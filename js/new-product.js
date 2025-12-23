let cardsN = document.querySelector(".New_product");
let cardN = document.querySelectorAll(".cardN");

fetch("https://oliver1ck.pythonanywhere.com/api/get_new_products/")
  .then(response => response.json())
  .then(data => {
    for (let result of data.results) {
      const div = document.createElement("div");
      div.classList.add("cardN");
      const sale = result.sale.title !== "Нет акции";

      div.innerHTML = `
      ${sale ? `<div class="sale">Акция</div>` : ``}
        <img src="${result.image_prev}" alt="" class="imgCard">
        <h3 class ="product">${result.title}</h3>
        <div class="kg">
          ${result.countitemproduct_set.map(item =>
        `<button class="btnKg">${item.value} ${item.unit}</button>`
      ).join('')}
        </div>
        <div class="price">
          <p class="byn">${result.price} BYN</p>
          <button class="cart">+<img src="./image/cart_major.png" alt=""class="imgCart"></button>
        </div>
        <button class="buy">Купить в 1 клик</button>
      `;
      cardsN.append(div);
    }
    updateCardDataN();
  });