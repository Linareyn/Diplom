const articlesContainer = document.querySelector('.article-list');

fetch("https://oliver1ck.pythonanywhere.com/api/get_articles_slider/")
  .then(response => response.json())
  .then(data => {
    articlesContainer.innerHTML = '';

    data.results.forEach(article => {
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article');
      articleDiv.style.cursor = 'pointer';

      articleDiv.innerHTML = `
        <img src="${article.image}" class="img-article" alt="${article.title}">
        <div class="articalText">
          <h3>${article.title}</h3>
          <p>${article.text.substring(0, 150)}...</p>
        </div>
        <div class="readTime">
          <div>
            <img src="./image/clock_minor.png" alt="">
            <p>Время чтения: ${article.read_time} мин.</p>
          </div>
          <div>
            <img src="./image/calendar.png" alt="">
            <p>${new Date(article.date_create).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      `;

      articleDiv.addEventListener('click', () => {
        window.location.href = `./article-details.html?id=${article.id}`;
      });

      articlesContainer.appendChild(articleDiv);
    });
    initArticlesSlider();
  });

function initArticlesSlider() {
  const slider = document.querySelector('.article-list');
  const prevBtn = document.querySelector('.prev-articles');
  const nextBtn = document.querySelector('.next-articles');

  if (!slider || !prevBtn || !nextBtn) return;

  let currentPosition = 0;
  let cardWidth = 0;
  let maxPosition = 0;
  let gap = 30;

  function updateSliderParams() {
    const cards = slider.querySelectorAll('.article');
    if (cards.length === 0) return;

    cardWidth = cards[0].offsetWidth + gap;

    const visibleArea = slider.parentElement.offsetWidth;
    const totalWidth = cards.length * cardWidth - gap;
    if (totalWidth > visibleArea) {
      maxPosition = -(totalWidth - visibleArea);
    } else {
      maxPosition = 0;
    }

    if (currentPosition < maxPosition) currentPosition = maxPosition;
    if (currentPosition > 0) currentPosition = 0;

    slider.style.transform = `translateX(${currentPosition}px)`;
  }

  function moveLeft() {
    if (currentPosition >= 0) return;
    currentPosition += cardWidth;
    if (currentPosition > 0) currentPosition = 0;
    slider.style.transform = `translateX(${currentPosition}px)`;
  }

  function moveRight() {
    if (currentPosition <= maxPosition) return;
    currentPosition -= cardWidth;
    if (currentPosition < maxPosition) currentPosition = maxPosition;
    slider.style.transform = `translateX(${currentPosition}px)`;
  }

  updateSliderParams();
  window.addEventListener('resize', updateSliderParams);

  prevBtn.addEventListener('click', moveLeft);
  nextBtn.addEventListener('click', moveRight);
}