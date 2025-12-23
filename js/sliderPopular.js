let leftArrow = document.querySelector(".left-popular");
let rightArrow = document.querySelector(".right-popular");
let value = 0;

let cardWidth = 0;
let gap = 30;
let maxLeft = 0;


function updateCardData() {
  card = document.querySelectorAll(".card");
  if (card.length > 0) {
    cardWidth = card[0].clientWidth;
    maxLeft = -((card.length - 4) * (cardWidth + gap));
  }
}

leftArrow.addEventListener('click', moveLeft);
rightArrow.addEventListener('click', moveRight);


function moveLeft() {
  console.log(value);
  if (value >= 0) return;
  value += gap + cardWidth;
  cards.style.transform = `translateX(${value}px)`;
}

function moveRight() {
  console.log(value);
  if (value <= maxLeft) return;
  value -= gap + cardWidth;
  cards.style.transform = `translateX(${value}px)`;
}