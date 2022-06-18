const arrowUp = document.querySelector('#myBtn');

// Коли користувач прокручує вниз на 20 пікселів від верхньої частини документа, показуємо кнопку
window.onscroll = function () {
  scrollFunction();
};

arrowUp.addEventListener('click', topFunction);

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    arrowUp.style.display = 'block';
  } else {
    arrowUp.style.display = 'none';
  }
}

//  Коли користувач натискає кнопку, прокручуємо до верхньої частини документа
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
