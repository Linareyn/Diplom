const leftArrow = document.querySelector('.left-popular');
const rightArrow = document.querySelector('.right-popular');
let popularPosition = 0;
let popularCardWidth = 0;
let popularMaxLeft = 0;
const gap = 30;

function updatePopularSlider() {
    const container = window.popularContainer || document.querySelector('.Popular_Product');
    if (!container) return;
    const cards = container.querySelectorAll('.card');
    if (cards.length === 0) return;
    popularCardWidth = cards[0].offsetWidth;
    const visibleCount = Math.floor(container.parentElement.offsetWidth / (popularCardWidth + gap));
    const maxMove = cards.length - visibleCount;
    popularMaxLeft = -maxMove * (popularCardWidth + gap);
    if (popularPosition > 0) popularPosition = 0;
    if (popularPosition < popularMaxLeft) popularPosition = popularMaxLeft;
    container.style.transform = `translateX(${popularPosition}px)`;
}

function moveLeft() {
    if (popularPosition >= 0) return;
    popularPosition += popularCardWidth + gap;
    if (popularPosition > 0) popularPosition = 0;
    const container = window.popularContainer || document.querySelector('.Popular_Product');
    if (container) container.style.transform = `translateX(${popularPosition}px)`;
}

function moveRight() {
    if (popularPosition <= popularMaxLeft) return;
    popularPosition -= popularCardWidth + gap;
    if (popularPosition < popularMaxLeft) popularPosition = popularMaxLeft;
    const container = window.popularContainer || document.querySelector('.Popular_Product');
    if (container) container.style.transform = `translateX(${popularPosition}px)`;
}

if (leftArrow) leftArrow.addEventListener('click', moveLeft);
if (rightArrow) rightArrow.addEventListener('click', moveRight);
window.addEventListener('resize', () => updatePopularSlider());

window.initPopularSlider = function() {
    popularPosition = 0;
    updatePopularSlider();
};