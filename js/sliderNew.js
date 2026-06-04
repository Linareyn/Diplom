const leftArrowNew = document.querySelector('.left-new');
const rightArrowNew = document.querySelector('.right-new');
let newPosition = 0;
let newCardWidth = 0;
let newMaxLeft = 0;
const gapNew = 30;

function updateNewSlider() {
    const container = window.newContainer || document.querySelector('.New_product');
    if (!container) return;
    const cards = container.querySelectorAll('.cardN');
    if (cards.length === 0) return;
    newCardWidth = cards[0].offsetWidth;
    const visibleCount = Math.floor(container.parentElement.offsetWidth / (newCardWidth + gapNew));
    const maxMove = cards.length - visibleCount;
    newMaxLeft = -maxMove * (newCardWidth + gapNew);
    if (newPosition > 0) newPosition = 0;
    if (newPosition < newMaxLeft) newPosition = newMaxLeft;
    container.style.transform = `translateX(${newPosition}px)`;
}

function moveNewLeft() {
    if (newPosition >= 0) return;
    newPosition += newCardWidth + gapNew;
    if (newPosition > 0) newPosition = 0;
    const container = window.newContainer || document.querySelector('.New_product');
    if (container) container.style.transform = `translateX(${newPosition}px)`;
}

function moveNewRight() {
    if (newPosition <= newMaxLeft) return;
    newPosition -= newCardWidth + gapNew;
    if (newPosition < newMaxLeft) newPosition = newMaxLeft;
    const container = window.newContainer || document.querySelector('.New_product');
    if (container) container.style.transform = `translateX(${newPosition}px)`;
}

if (leftArrowNew) leftArrowNew.addEventListener('click', moveNewLeft);
if (rightArrowNew) rightArrowNew.addEventListener('click', moveNewRight);
window.addEventListener('resize', () => updateNewSlider());

window.initNewSlider = function() {
    newPosition = 0;
    updateNewSlider();
};