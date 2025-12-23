let leftArrowN = document.querySelector(".left-new");
let rightArrowN = document.querySelector(".right-new");
let valueN = 0;

let cardWidths = 0;
let gapN = 30;
let maxLefts = 0;


function updateCardDataN() {
  cardN = document.querySelectorAll(".cardN");
  if (cardN.length > 0) {
    cardWidths = cardN[0].clientWidth;
    maxLefts = -((cardN.length - 4) * (cardWidths + gapN));
  }
}


leftArrowN.addEventListener('click', moveLeft);
rightArrowN.addEventListener('click', moveRight);


function moveLeft() {
  console.log(valueN);
  if (valueN >= 0) return;
  valueN += gapN + cardWidths;
  cardsN.style.transform = `translateX(${valueN}px)`;
}

function moveRight() {
  console.log(valueN);
  if (valueN <= maxLefts) return;
  valueN -= gapN + cardWidths;
  cardsN.style.transform = `translateX(${valueN}px)`;
}