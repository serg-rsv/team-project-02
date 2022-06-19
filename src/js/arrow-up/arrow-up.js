const { throttle } = require('lodash');

const arrowUp = document.querySelector('#button-up');
console.log('arrowUp :>> ', arrowUp);
// Коли користувач прокручує вниз на 20 пікселів від верхньої частини документа, показуємо кнопку
window.onscroll = throttle(scrollFunction, 400);

arrowUp.addEventListener('click', topFunction);

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    arrowUp.classList.add('button-up-active');
    return;
  } else {
    arrowUp.classList.remove('button-up-active');
  }
}

//  Коли користувач натискає кнопку, прокручуємо до верхньої частини документа
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
