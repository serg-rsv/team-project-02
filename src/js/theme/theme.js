import btnChangeTheme from '~/templates/btn-theme.hbs';

// ссылка на элементы, кот изменяются
const changedElements = {
  body: document.querySelector('body'),
  footer: document.querySelector('.footer'),
  filmTitle: document.querySelector('.film-list'),
  main: document.querySelector('main'),
};

// кнопка смены темы
changedElements.main.insertAdjacentHTML('beforeend', btnChangeTheme());

// ссылки на кнопку смены темы
const refs = {
  changeThemeBtns: document.querySelectorAll('.change-theme'),
  light: document.querySelector('[data-theme="light"]'),
  dark: document.querySelector('[data-theme="dark"]'),
};

refs.light.setAttribute('style', 'display:none;');

// проверка локалстор...
if (localStorage.getItem('theme') === 'dark') {
  onChangeTheme();
}

// слушатель на кнопку
refs.changeThemeBtns.forEach(button => {
  button.addEventListener('click', onChangeTheme);
});

// смена стиля(bcg) и иконки при клике
function onChangeTheme() {
  if (refs.light.hasAttribute('style')) {
    // dark theme
    localStorage.setItem('theme', 'dark');
    // иконка
    refs.light.removeAttribute('style');
    refs.dark.setAttribute('style', 'display:none;');
    // класс
    changedElements.body.classList.add('theme-dark');
    changedElements.footer.classList.add('theme-dark');
    changedElements.filmTitle.classList.add('theme-dark');
    return;
  }

  // light theme
  localStorage.removeItem('theme');
  // иконка
  refs.dark.removeAttribute('style');
  refs.light.setAttribute('style', 'display:none;');
  // класс
  changedElements.body.classList.remove('theme-dark');
  changedElements.footer.classList.remove('theme-dark');
  changedElements.filmTitle.classList.remove('theme-dark');
}
