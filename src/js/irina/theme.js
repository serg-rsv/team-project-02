import { add } from 'lodash';
import btnChangeTheme from '~/templates/btn-theme.hbs';

// кнопка для смены темы
const body = document.querySelector('body');
body.insertAdjacentHTML('beforeend', btnChangeTheme());
// ссылки на кнопки
const refs = {
    changeThemeBtns:document.querySelectorAll('.change-theme'),
    light: document.querySelector('[data-theme="light"]'),
    dark: document.querySelector('[data-theme="dark"]'),
};
// console.log(Object.keys(refs))

// ссылка на элементы, кот изменяются
const changedElements = {
    footer: document.querySelector('.footer'),
    footerText: document.querySelector('.footer-text'),
    footerHeart: document.querySelector('.footer-heart'),
    footerLink:document.querySelector('.footer__link')
};

refs.light.setAttribute("style", "display:none;");

// проверка локалстор...
if (localStorage.getItem('theme') === 'dark') {
    onChangeTheme()
};

// слушатель на кнопку
refs.changeThemeBtns.forEach(button => {
    button.addEventListener('click', onChangeTheme);   
});
console.log(document.documentElement);
// смена стиля(bcg) и иконки при клике
function onChangeTheme() {
     if (refs.light.hasAttribute("style")) {
        // dark theme
         localStorage.setItem('theme', 'dark');
        refs.light.removeAttribute("style");
        refs.dark.setAttribute("style", "display:none;");

         
        //  body.classList.add('dark');
        //  changedElements.footer.classList.add('dark');
        //  changedElements.footerHeart.classList.add('dark');
        //  changedElements.footerText.classList.add('dark');
        //  changedElements.footerLink.classList.add('dark');
        //  const changedEl = Object.keys(changedElements);
        //  console.log(changedEl);
        //  changedEl.forEach(function (element) {
        //      console.log(element);
        //      const addClass = `changedElements.${element}.`;
        //      addClass.classList.add('dark');
        //  })
        //  for (const el of changedEl) {
        //      console.log(`changedElements.${el}`);
        //      `changedElements.${el}.classList.add('dark')`;
        //  }
        return;
        }
        // light theme
        localStorage.removeItem('theme');
        refs.dark.removeAttribute("style");
        refs.light.setAttribute("style", "display:none;");
    body.classList.remove('dark');
    footer.classList.remove('dark');
}


