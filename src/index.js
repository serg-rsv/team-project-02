import './sass/main.scss';
import './js/arrow-up/arrow-up';
import './js/irina/theme';

import _ from 'lodash';

import { tmdbApi } from './js/services/tmdb-api';
import { openDetailsCard } from './js/kaplunenko/render';
import { renderMainPage } from './js/kaplunenko/render';
import { autorisationFormCall } from './js/form/autorizaton-modal-call';
import { autorizationFormUiValid } from './js/form/form-ui-valid';
import { homeRender, libraryRender } from './js/header/change-header';
import { authApi } from './js/services/auth';
import { databaseApi } from './js/services/db';
import { Notify } from 'notiflix';
import { showTeamModal } from './js/Fedorenko/team-modal';

Notify.init({ clickToClose: true, position: 'center-top' });

const refs = {
  homeBtns: document.querySelectorAll('[data-load="home"]'),
  libraryBtn: document.querySelector('[data-load="library"]'),
  filmsList: document.querySelector('.films_list'),
  searchInput: document.querySelector('#name-input'),
  watchedBtn: document.querySelector('[data-action="watched"]'),
  queueBtn: document.querySelector('[data-action="queue"]'),
  teamLnk: document.querySelector('.js-team-link'),
  boxLoginBtns: document.querySelector('.header__logbuttons-list'),
  logInBtn: document.querySelector('[data-log="in"]'),
  logOutBtn: document.querySelector('[data-log="out"]'),
  headerEl: document.querySelector('header'),
};

const storage = {
  userId: null,
  isSingIn: false,
  watched: [], // тут будуть зберігатись данні з ФБ ,
  queue: [], //тут будуть зберігатись данні з ФБ ,
  movies: [], // сюди записуємо об'єкти фільмів які відрендерили на екрані
  currentTab: 'watched', // для перемикання між кнопками watched & queue
};

// перелік єкшенів в submit інпутах форми, щоб зе робити помилку
const ACTION_TYPE = {
  SIGN_IN_WITH_EMAIL_AND_PASSWORD: 'sign-in-with-email-password',
  SIGN_UP_WiTH_EMAIL_AND_PASSWORD: 'sign-up-with-email-password',
  SIGN_IN_WITH_GOOGLE: 'sign-in-with-google-account',
};

async function launch() {
  // {show loader}
  // =============== Prokoptsov ===================//
  // визначаємо чи залогінений юзер у системі при завантаженні сторінки та виконуємо логіку у колбеках
  authApi.trackUserLoginState(userIsSignedIn, userIsSignedOut);
  // =================================================
  await infinityScrollData();
  // {hide loader}
}

launch();

refs.homeBtns.forEach(btn => btn.addEventListener('click', onHomeBtn));
refs.libraryBtn.addEventListener('click', onLibBtn);
refs.searchInput.addEventListener('input', _.debounce(onSearchInput, 500));
refs.watchedBtn.addEventListener('click', onNavigate);
refs.queueBtn.addEventListener('click', onNavigate);
refs.filmsList.addEventListener('click', onMovieCard);
refs.teamLnk.addEventListener('click', onTeamLnk);
refs.logInBtn.addEventListener('click', onLogInBtn);
refs.logOutBtn.addEventListener('click', onLogOutBtn);

// authApi.trackUserLoginState() ----> функція має викликатися найпершою
// і обовєязково з колбеками, які запишуть до стору стан користувача
// я перевірив - нічого повренути із ціє функції окрім самої функції неможна.
//
// попроную створити файл та назвати його HandleUserState
// він буду містити два колбека:
// const userIsSignedIn = (userId) => {
//     одразу зберегти id юзера, який у коблек прийду з authApi.trackUserLoginState
//     store.userId = userId;
//
//     також записати стан до store
//     store.isSignedIn = true;
//     тут ще можна вивести нотіфікашку ти "З поверненням, ${пошта юзера}"
// }
// const userIsSignedOut = () => {
//     записати стан до store
//     store.isSignedIn = false;
// }
// і тоді передавати їх наступним чином
// authApi.trackUserLoginState(userIsSignedIn, userIsSignedOut)
//  це важливо

// =============== LOGIN ===============>
function onLogInBtn() {
  // - отрисовать форму регистрации/авторизации
  const modal = autorisationFormCall();
  autorizationFormUiValid();
  // ================= Prokoptsov ===========/
  // пілся появи форми знаходимо її у DOM
  const formRef = document.querySelector('[data-js="auth-form"]');
  // вішаємо слухач, та додаємо обробник подіїї

  formRef.addEventListener('click', (e) => onAuthFormClick(e, modal));
}

function onLogOutBtn() {
  authApi.signOut();
  storage.isSingIn = false;
  if (refs.headerEl.classList.contains('header-lib')) {
    homeRender();
    tmdbApi.resetTrendingPage();
    refs.filmsList.innerHTML = '';
    infinityScrollData();
  }
  refs.boxLoginBtns.classList.remove('authorized');
}
// <============== LOGIN ===============
// =============== Sveta ===============>
function onTeamLnk() {
  showTeamModal();
}
// <============== Sveta ===============

function onHomeBtn() {
  // todo
  // - отрисовать шапку главной страницы (вспомагательная функция для рендера - Таня)
  homeRender();
  storage.movies = [];
  // - отрисовать галерею трендовых фильмов в мэйн (renderMainPage - Саша)
  // {show loader}
  refs.searchInput.value = '';
  refs.filmsList.innerHTML = '';
  tmdbApi.resetTrendingPage();
  infinityScrollData();
  // {hide loader}
}

// =====================================================================================================
async function onSearchInput(e) {
  // todo
  const query = e.target.value.trim();
  // - проверить что запрос не пустая строка
  if (query === '') {
    return;
  }

  await tmdbApi.fetchSearchMovie(query);
  // - если ничего не найдено по запросу
  // - вывести уведомление 'Search result not successful.'
  if (tmdbApi.searchMovieTotalPage === 0) {
    Notify.warning('Search result not successful. Enter the correct movie name and try again.');
    return;
  }
  // відмальовуємо знайдені фільми
  refs.filmsList.innerHTML = '';
  tmdbApi.resetSearchMoviePage();
  infinityScrollData(query);
}

function onLibBtn() {
  // todo
  if (!storage.isSingIn) {
    Notify.info('Please Log-in');
    return;
  }
  // - отрисовать шапку библиотеки
  libraryRender();

  // ===================================//
  refs.filmsList.innerHTML = '';
  switch (storage.currentTab) {
    case 'watched':
      storage.watched.length
        ? renderMainPage(storage.watched)
        : refs.filmsList.insertAdjacentHTML(
            'afterbegin',
            '<h2>Nothing has been added to queue</h2>',
          );
      break;
    case 'queue':
      storage.queue.length
        ? renderMainPage(storage.queue)
        : refs.filmsList.insertAdjacentHTML(
            'afterbegin',
            '<h2>Nothing has been added to queue</h2>',
          );
    default:
      break;
  }

  //================= Prokoptsov ==========================//
  // це треба пергий раз робити одразу, як перейшли на вкладку MyLibrary
  databaseApi.get('watched', storage.userId).then(moviList => {
    refs.filmsList.innerHTML = '';
    console.log(moviList);
    renderMainPage(moviList)
  }).catch(console.log);
  // ========= Prokoptsov.
  // ще тут треба робити запит до Firebase за фільмами Watched, якщо користувач у системі
  // а потім відмальовувати іх. Це буду виглядати так
  // databaseApi.get(DB_ENDPOINTS.WATCHED, store.userId, onGetWatchedMovieRender)
  //
  // onGetWatchedMovieRender ---> колбек-функція, яка після відповіді від FireBase
  // буду рендерети масив доданих фільмів.
  // const onGetWatchedMovieRender = (watchedMovieArray) => renderMainPage(watchedMovieArray);
  // або одразу передати цю функцію як колбек
  // databaseApi.get(DB_ENDPOINTS.WATCHED, store.userId, renderMainPage)
  // Бо знову ж таки, функція нічого не повертає, тому треба колбек
  // ==============
}
function onAuthFormClick(e, modalInstance) {
  e.preventDefault();

  const action = e.target.parentElement.name;
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;

  switch (action) {
    case ACTION_TYPE.SIGN_IN_WITH_EMAIL_AND_PASSWORD:
      authApi.signInWithEmailAndPassword(email, password);
      break;
    case ACTION_TYPE.SIGN_UP_WiTH_EMAIL_AND_PASSWORD:
      authApi.createUserWithEmailAndPassword(email, password);
      break;
    case ACTION_TYPE.SIGN_IN_WITH_GOOGLE:
      authApi.signInWithGoogle();
      break;
    default:
      return;
  }

  e.currentTarget.reset();
}

// =======================================================//

function onNavigate(event) {
  const currentTab = event.target.dataset.action;

  if (storage.currentTab === currentTab) return;
  // console.log(storage);
  // console.log(storage.currentTab);
  storage.currentTab = currentTab;
  toggleButtons(currentTab);

  refs.filmsList.innerHTML = '';
  switch (storage.currentTab) {
    case 'watched':
      storage.watched.length
        ? renderMainPage(storage.watched)
        : refs.filmsList.insertAdjacentHTML(
            'afterbegin',
            '<h2>Nothing has been added to queue</h2>',
          );
      break;
    case 'queue':
      storage.queue.length
        ? renderMainPage(storage.queue)
        : refs.filmsList.insertAdjacentHTML(
            'afterbegin',
            '<h2>Nothing has been added to queue</h2>',
          );
    default:
      break;
  }
}
/**
 * ф-я перемикає стан кнопок: disabled/ enabled. та присвоює/видаляє клас, щоб підсвітити активну кнопку;
 * @param {string} currentTab -де саме був клік;
 */
function toggleButtons(currentTab) {
  if (currentTab === 'watched') {
    refs.queueBtn.classList.remove('current-button');
    refs.watchedBtn.classList.add('current-button');
    // refs.queueBtn.disabled = false; // потрібно вирішити, чи будемо дізаблити ці кнопки
    // refs.watchedBtn.disabled = true; // бо натиснути їх можна лише раз. Можливо як додатково UI для юзера?
  }
  if (currentTab === 'queue') {
    refs.watchedBtn.classList.remove('current-button');
    refs.queueBtn.classList.add('current-button');
    // refs.queueBtn.disabled = true;
    // refs.watchedBtn.disabled = false;
  }
}

// <============== Taras ===============

function onMovieCard(e) {
  // todo
  // - проверить что клик именно по карточке фильма
  const cardFilm = e.target.closest('.products__cards-item');
  if (cardFilm === null) {
    return;
  }
  // - получить детальную информацию из памяти
  const movieId = Number(cardFilm.dataset.movieId);
  // ?замінити метод отримання фільму
  let movieData;
  if (!refs.headerEl.classList.contains('header-lib')) {
    movieData = storage.movies.find(movie => movie.id == movieId);
  } else {
    switch (storage.currentTab) {
      case 'watched':
        movieData = storage.watched.find(movie => movie.id == movieId);
        break;
      case 'queue':
        movieData = storage.queue.find(movie => movie.id == movieId);
      default:
        break;
    }
  }
  console.log('Movie in Modal:', movieData);
  // - создать модальное окно
  openDetailsCard(movieData, '.form_close-button');
  // - поиск кнопок watched queue------------------------------------------
  const watchedBtn = document.querySelector('#watched');
  const queueBtn = document.querySelector('#queue');

  watchedBtn.addEventListener('click', onModalWatchedBtn);
  queueBtn.addEventListener('click', onModalQueueBtn);
  // *************************************************
  async function changeNameBtn() {
    //змінює текст та атрибути кнопок додати/видалити
    const { isInWatched, isInQueue } = await databaseApi.check(storage.userId, movieId);
    try {
      if (isInWatched) {
        //якщо фільм є в 'watched'
        watchedBtn.setAttribute('data-action', 'del-watched'); // змінюємо атрибут,
        watchedBtn.textContent = 'DELETE WATCHED'; // текстконтент і клас
        watchedBtn.classList.add('delete-button');
      } else {
        watchedBtn.setAttribute('data-action', 'add-watched');
        watchedBtn.textContent = 'ADD WATCHED';
        watchedBtn.classList.remove('delete-button');
      }

      if (isInQueue) {
        //якщо фільм є в 'queue'
        queueBtn.setAttribute('data-action', 'del-queue');
        queueBtn.textContent = 'DELETE QUEUE';
        queueBtn.classList.add('delete-button');
      } else {
        queueBtn.setAttribute('data-action', 'add-queue');
        queueBtn.textContent = 'AD QUEUE';
        queueBtn.classList.remove('delete-button');
      }
    } catch (error) {
      handleError(error);
    }
  }
  // викликаємо функцію для зміни кнопок коли є клік на карточці фільму;
  if (cardFilm) {
    changeNameBtn();
  } else {
    Notify.warning('Download, please wait a bit ');
  }

  function handleError(error) {
    console.log(error);
    Notify.info('Oops, somthing wrong');
  }

  function onModalWatchedBtn() {
    if (watchedBtn.dataset.action === 'add-watched') {
      // - додати об'єкт фільму по movieId в ФБ
      databaseApi
        .add('watched', storage.userId, movieData)
        .then(() => {
          watchedBtn.setAttribute('data-action', 'del-watched'); // - поміняти кнопці текст контент і дата сет атрибут
          watchedBtn.textContent = 'DELETE WATCHED';
          watchedBtn.classList.add('delete-button'); // - додати клас актив
        })
        .catch(handleError);

      return;
    }
    if (watchedBtn.dataset.action === 'del-watched') {
      // - видалити об'єкт фільму по movieId з ФБ
      databaseApi
        .delete('watched', storage.userId, movieId)
        .then(() => {
          watchedBtn.setAttribute('data-action', 'add-watched'); // - поміняти кнопці текст контент і дата сет атрибут
          watchedBtn.textContent = 'ADD WATCHED';
          watchedBtn.classList.remove('delete-button'); // - зняти клас актив
        })
        .catch(handleError);

      return;
    }
  }
  // ------------------------------------------------
  function onModalQueueBtn() {
    if (queueBtn.dataset.action === 'add-queue') {
      databaseApi
        .add('queue', storage.userId, movieData)
        .then(() => {
          // - додати об'єкт фільму по movieId в ФБ
          queueBtn.setAttribute('data-action', 'del-queue'); // - поміняти кнопці текст контент і дата сет атрибут
          queueBtn.textContent = 'DELETE QUEUE';
          queueBtn.classList.add('delete-button'); // - додати клас актив
        })
        .catch(handleError);
      return;
    }
    if (queueBtn.dataset.action === 'del-queue') {
      databaseApi
        .delete('queue', storage.userId, movieId)
        .then(() => {
          // - видалити об'єкт фільму по movieId з ФБ
          queueBtn.setAttribute('data-action', 'add-queue'); // - поміняти кнопці текст контент і дата сет атрибут
          queueBtn.textContent = 'AD QUEUE';
          queueBtn.classList.remove('delete-button'); // - зняти клас актив
        })
        .catch(handleError);

      return;
    }
  }
  // - databaseApi.check - проверить наличие этого фильма в фаербэйз в просмотренных и в очередеи
  // - отрисовать модалку с детальной информацией по фильму
  // - отрисовать кнопки соответсвенно добавить/удалить
  // - получить ссылки на кнопки 'add/del to watched' и 'add/del to queue' и повесить слушатели
}

// ********************************
// =============== Prokoptsov ==============
// Ще раз повторюсь, треба не забувати ВИДАЛЯТИ СЛУХАЧІ!!!!!!!!!
// І формою реєстрації я займаюсь, то я вже і напишу всі обробники і логіку, якщо ти не проти :=))
// Тільки ЗА :D

// =============== Niko ===============>
/**
 *
 * @param {string} query  - Необов'язковий параметр, потрібен, якщо дані, які требя відмальовувати формуються
 * за строковим запитом query до API. query - це і є наш строковий запит
 * @returns {Promise} - повертає проміс, в якому зберігаються дані з API за нашим запитом
 */
async function infinityScrollData(query) {
  if (refs.headerEl.classList.contains('header-lib')) {
    console.log('exit at start infinity()');
    return;
  }
  try {
    let movies;
    if (!query) {
      movies = await tmdbApi.fetchTrendingMovies();
    }
    if (query) {
      movies = await tmdbApi.fetchSearchMovie(query);
    }
    if (refs.headerEl.classList.contains('header-lib')) {
      console.log('exit befor render infinity()');
      return;
    }
    renderMainPage(movies);
    storage.movies.push(...movies);
    if (movies.length < 20 || tmdbApi.trendingPage > tmdbApi.trendingTotalPage) return;
    const triggeredLoadMoreElement = document.querySelector(
      '.products__cards-item:nth-last-child(4) img',
    );
    if (triggeredLoadMoreElement) triggeredLoadMoreElement.addEventListener('load', onLoad);
    function onLoad() {
      if (triggeredLoadMoreElement) triggeredLoadMoreElement.removeEventListener('load', onLoad);
      if (refs.headerEl.classList.contains('header-lib')) {
        console.log('exit before loadMore()');
        return;
      }
      loadMore(infinityScrollData, query);
    }
    return new Promise(resolve => resolve(movies));
  } catch (error) {
    Notify.failure(error.message);
  }
}

/**
 *
 * @param {function} callback - Функція, яка буде викликана після того, як третій параметр (селектор) з'явиться на екрані.
 * @param {string} query - запит. Необов'язковий параметр, потрібен в якості атрибуту функциї callback.
 * @param {string} selector - Селектор елементу, після якого буде додано нові дані. Обсервер чекає, доки цей елемент з'явиться на сторінці. По замовчанню '.products__cards-item:last-child'.
 */
function loadMore(callback, query, selector = '.products__cards-item:last-child') {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          console.log('load more ', query);
          callback(query);
        }
      });
    },
    {
      threshold: 0.5, // Процентне відношення елемента до відображення на екрані.
    },
  );

  if (document.querySelector(selector)) {
    observer.observe(document.querySelector(selector));
  }
}
// <============== Niko ===============

// ================== Prokoptsov =================//
// оброблює реєстрацію та логін
function onAuthFormClick(e, modalInstance) {
  e.preventDefault();

  const action = e.target.parentElement.name;
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;

  switch (action) {
    case ACTION_TYPE.SIGN_IN_WITH_EMAIL_AND_PASSWORD:
      authApi.signInWithEmailAndPassword(email, password, (user) => {
        onSignInSuccess(user)
        modalInstance.close();
      }, onSiginInError)
      break;
    case ACTION_TYPE.SIGN_UP_WiTH_EMAIL_AND_PASSWORD:
      authApi.createUserWithEmailAndPassword(email, password, (user) => {
        onSignInSuccess(user)
        modalInstance.close();
      }, onSiginInError)
      break;
    case ACTION_TYPE.SIGN_IN_WITH_GOOGLE:
      authApi.signInWithGoogle((user) => {
        onSignInSuccess(user)
        modalInstance.close();
      }, onSiginInError)
      break;
    default:
      return;
  }

  e.currentTarget.reset();
}

// колбек на випадок успіщноїї реєстрації та успішного логіну
function onSignInSuccess(user) {
  storage.userId = user.uid;
  storage.isSingIn = true;
}
// колбек на випадок, коли юзер вже залогінений при завантаженні сторінки
function userIsSignedIn(user) {
  storage.userId = user.uid;
  storage.isSingIn = true;

  refs.boxLoginBtns.classList.add('authorized');

  Notify.info(`Welcome, ${user.email}`);

  addListenerOnWatchedFB();
  addListenerOnQueueFB();
}

// колбек на вилогінювання юзера
function userIsSignedOut() {
  console.log('You are not signed in');
}

// колбек для обробки помилки при запиті.
function onSiginInError(error) {
  // нормалізує повідомлення помилки з ФБ
  const indexOfSlash = error.code.indexOf('/');
  const normalizedErrorMessage =
    error.code.slice(indexOfSlash + 1)[0].toUpperCase() +
    error.code.slice(indexOfSlash + 2).replaceAll('-', ' ');

  Notify.failure(`Ups... ${normalizedErrorMessage}`);
}

// ===============================================//

function addListenerOnWatchedFB() {
  console.log('addListenerOnWatchedFB-->');
  // databaseApi.get('watched', storage.userId, onChangeWatched);
  databaseApi.get('watched', storage.userId, onChangeWatched);
}
function addListenerOnQueueFB() {
  console.log('addListenerOnQueueFB-->');
  databaseApi.get('queue', storage.userId, onChangeQueue);
}
// колбекs щоб відмалювати додані ФБ
function onChangeWatched(movieList) {
  storage.watched = [...movieList];
  console.log('onChangeWatched', storage.watched);
  if (
    refs.headerEl.classList.contains('header-lib') &&
    refs.watchedBtn.classList.contains('current-button')
  ) {
    refs.filmsList.innerHTML = '';
    storage.watched.length
      ? renderMainPage(storage.watched)
      : refs.filmsList.insertAdjacentHTML(
          'afterbegin',
          '<h2>Nothing has been added to watched</h2>',
        );
  }
  console.log('Мы в хэдере || Lib.QUEUE');
  return;
}

function onChangeQueue(movieList) {
  storage.queue = [...movieList];
  console.log('onChangeQueue', storage.queue);
  if (
    refs.headerEl.classList.contains('header-lib') &&
    refs.queueBtn.classList.contains('current-button')
  ) {
    refs.filmsList.innerHTML = '';
    storage.queue.length
      ? renderMainPage(storage.queue)
      : refs.filmsList.insertAdjacentHTML('afterbegin', '<h2>Nothing has been added to queue</h2>');
  }
  console.log('Мы в хэдере || Lib.WATCHED');
  return;
}
