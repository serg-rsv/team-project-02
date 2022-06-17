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

refs.light.setAttribute("style", "display:none;");

// проверка локалстор...
if (localStorage.getItem('theme') === 'dark') {
    onChangeTheme()
};

// навешен слушатель на кнопку
refs.changeThemeBtns.forEach(button => {
    button.addEventListener('click', onChangeTheme);   
});

// смена стиля и иконки при клике
function onChangeTheme() {
     if (refs.light.hasAttribute("style")) {
        // dark theme
         localStorage.setItem('theme', 'dark');
        refs.light.removeAttribute("style");
        refs.dark.setAttribute("style", "display:none;");

            
         body.classList.add('dark');
        return;
        }
        // light theme
        localStorage.removeItem('theme');
        refs.dark.removeAttribute("style");
        refs.light.setAttribute("style", "display:none;");
        body.classList.remove('dark');
}


