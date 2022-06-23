import './sass/main.scss';
import './js/arrow-up/arrow-up';
import './js/theme/theme';
import './js/team-modal/team-modal';

import _ from 'lodash';
import { Notify } from 'notiflix';

import { tmdbApi } from './js/services/tmdb-api';
import { openDetailsCard } from './js/render-main-page/render';
import { renderMainPage } from './js/render-main-page/render';
import { autorisationFormCall } from './js/form/autorizaton-modal-call';
import { autorizationFormUiValid } from './js/form/form-ui-valid';
import { homeRender, libraryRender } from './js/header/change-header';
import { authApi } from './js/services/auth';
import { databaseApi } from './js/services/db';
import loader from './js/loader/loader';
import { renderEmptyList, renderEmptySearch } from './js/render-empty-list';

Notify.init({ clickToClose: true, position: 'center-top' });

const refs = {
  homeBtns: document.querySelectorAll('[data-load="home"]'),
  libraryBtn: document.querySelector('[data-load="library"]'),
  filmsList: document.querySelector('.films_list'),
  searchInput: document.querySelector('#name-input'),
  watchedBtn: document.querySelector('[data-action="watched"]'),
  queueBtn: document.querySelector('[data-action="queue"]'),
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
  searchMovie: [], // список знайдених фільмів
  currentTab: 'watched', // для перемикання між кнопками watched & queue
};

// перелік єкшенів в submit інпутах форми, щоб зе робити помилку
const ACTION_TYPE = {
  SIGN_IN_WITH_EMAIL_AND_PASSWORD: 'sign-in-with-email-password',
  SIGN_UP_WiTH_EMAIL_AND_PASSWORD: 'sign-up-with-email-password',
  SIGN_IN_WITH_GOOGLE: 'sign-in-with-google-account',
};

async function launch() {
  loader.show(refs.filmsList, 'beforebegin');
  // =============== Prokoptsov ===================//
  // визначаємо чи залогінений юзер у системі при завантаженні сторінки та виконуємо логіку у колбеках
  authApi.trackUserLoginState(userIsSignedIn, userIsSignedOut);
  // =================================================
  await infinityScrollData();
  loader.hide();
}

launch();

refs.homeBtns.forEach(btn => btn.addEventListener('click', onHomeBtn));
refs.libraryBtn.addEventListener('click', onLibBtn);
refs.searchInput.addEventListener('input', _.debounce(onSearchInput, 1250));
refs.watchedBtn.addEventListener('click', onNavigate);
refs.queueBtn.addEventListener('click', onNavigate);
refs.filmsList.addEventListener('click', onMovieCard);
refs.logInBtn.addEventListener('click', onLogInBtn);
refs.logOutBtn.addEventListener('click', onLogOutBtn);

// =============== LOGIN ===============>
function onLogInBtn() {
  // - отрисовать форму регистрации/авторизации
  const modal = autorisationFormCall();
  autorizationFormUiValid();
  // ================= Prokoptsov ===========/
  // пілся появи форми знаходимо її у DOM
  const formRef = document.querySelector('[data-js="auth-form"]');
  // вішаємо слухач, та додаємо обробник подіїї
  formRef.addEventListener('click', e => onAuthFormClick(e, modal));
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
// <============== LOGOUT ===============

async function onHomeBtn() {
  loader.show(refs.filmsList, 'beforebegin');
  homeRender();

  storage.movies = [];
  refs.searchInput.value = '';
  refs.filmsList.innerHTML = '';

  tmdbApi.resetTrendingPage();
  await infinityScrollData();
  loader.hide();
}

async function onSearchInput(e) {
  const query = e.target.value.trim();

  if (query === '') {
    return;
  }

  loader.show(refs.filmsList, 'beforebegin');
  // await tmdbApi.fetchSearchMovie(query);

  // if (tmdbApi.searchMovieTotalPage === 0) {
  //   Notify.warning('Search result not successful. Enter the correct movie name and try again.');
  //   loader.hide();
  //   return;
  // }

  refs.filmsList.innerHTML = '';
  tmdbApi.resetSearchMoviePage();
  await infinityScrollData(query);
  loader.hide();
}

function onLibBtn() {
  if (!storage.isSingIn) {
    Notify.info('Please Log-in');
    return;
  }

  libraryRender();

  refs.filmsList.innerHTML = '';

  switch (storage.currentTab) {
    case 'watched':
      storage.watched.length ? renderMainPage(storage.watched) : renderEmptyList(refs.filmsList);
      break;
    case 'queue':
      storage.queue.length ? renderMainPage(storage.queue) : renderEmptyList(refs.filmsList);
    default:
      break;
  }
}

// =============== Taras ==============>
function onNavigate(event) {
  const currentTab = event.target.dataset.action;

  if (storage.currentTab === currentTab) return;

  storage.currentTab = currentTab;

  toggleButtons(currentTab);

  refs.filmsList.innerHTML = '';

  switch (storage.currentTab) {
    case 'watched':
      storage.watched.length ? renderMainPage(storage.watched) : renderEmptyList(refs.filmsList);
      break;
    case 'queue':
      storage.queue.length ? renderMainPage(storage.queue) : renderEmptyList(refs.filmsList);
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
  }

  if (currentTab === 'queue') {
    refs.watchedBtn.classList.remove('current-button');
    refs.queueBtn.classList.add('current-button');
  }
}

// <============== Taras ===============

function onMovieCard(e) {
  // - проверить что клик именно по карточке фильма
  const cardFilm = e.target.closest('.products__cards-item');
  if (cardFilm === null) {
    return;
  }
  // - получить детальную информацию из памяти
  const movieId = cardFilm.dataset.movieId;
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
  // - создать модальное окно
  openDetailsCard(movieData, '.form_close-button');

  const watchedBtn = document.querySelector('#watched');
  const queueBtn = document.querySelector('#queue');

  watchedBtn.addEventListener('click', onModalWatchedBtn);
  queueBtn.addEventListener('click', onModalQueueBtn);

  async function changeNameBtn() {
    // перевірка авторизації перед запитом до фб
    if (!storage.isSingIn) {
      return;
    }
    //змінює текст та атрибути кнопок додати/видалити
    const { isInWatched, isInQueue } = await databaseApi.check(storage.userId, movieId);
    try {
      if (isInWatched) {
        //якщо фільм є в 'watched'
        watchedBtn.setAttribute('data-action', 'del-watched'); // змінюємо атрибут,
        watchedBtn.textContent = 'DELETE FROM WATCHED'; // текстконтент і клас
        watchedBtn.classList.add('delete-button');
      } else {
        watchedBtn.setAttribute('data-action', 'add-watched');
        watchedBtn.textContent = 'ADD TO WATCHED';
        watchedBtn.classList.remove('delete-button');
      }

      if (isInQueue) {
        //якщо фільм є в 'queue'
        queueBtn.setAttribute('data-action', 'del-queue');
        queueBtn.textContent = 'DELETE FROM QUEUE';
        queueBtn.classList.add('delete-button');
      } else {
        queueBtn.setAttribute('data-action', 'add-queue');
        queueBtn.textContent = 'ADD TO QUEUE';
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
    // console.log(error);
    Notify.info('Oops, somthing wrong');
  }

  function onModalWatchedBtn() {
    if (!storage.isSingIn) {
      Notify.info('Please Log-in');
      return;
    }
    if (watchedBtn.dataset.action === 'add-watched') {
      // - додати об'єкт фільму по movieId в ФБ
      databaseApi
        .add('watched', storage.userId, movieData)
        .then(() => {
          watchedBtn.setAttribute('data-action', 'del-watched'); // - поміняти кнопці текст контент і дата сет атрибут
          watchedBtn.textContent = 'DELETE FROM WATCHED';
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
          watchedBtn.textContent = 'ADD TO WATCHED';
          watchedBtn.classList.remove('delete-button'); // - зняти клас актив
        })
        .catch(handleError);

      return;
    }
  }

  function onModalQueueBtn() {
    if (!storage.isSingIn) {
      Notify.info('Please Log-in');
      return;
    }
    if (queueBtn.dataset.action === 'add-queue') {
      databaseApi
        .add('queue', storage.userId, movieData)
        .then(() => {
          // - додати об'єкт фільму по movieId в ФБ
          queueBtn.setAttribute('data-action', 'del-queue'); // - поміняти кнопці текст контент і дата сет атрибут
          queueBtn.textContent = 'DELETE FROM QUEUE';
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
          queueBtn.textContent = 'ADD TO QUEUE';
          queueBtn.classList.remove('delete-button'); // - зняти клас актив
        })
        .catch(handleError);

      return;
    }
  }
}
// =============== Niko ===============>
/**
 *
 * @param {string} query  - Необов'язковий параметр, потрібен, якщо дані, які требя відмальовувати формуються
 * за строковим запитом query до API. query - це і є наш строковий запит
 * @returns {Promise} - повертає проміс, в якому зберігаються дані з API за нашим запитом
 */
async function infinityScrollData(query) {
  if (refs.headerEl.classList.contains('header-lib')) return;

  try {
    let movies;
    if (!query) {
      movies = await tmdbApi.fetchTrendingMovies();
    }
    if (query) {
      storage.searchMovie = await tmdbApi.fetchSearchMovie(query);

      if (storage.searchMovie.length === 0) {
        // Notify.warning('Search result not successful. Enter the correct movie name and try again.');
        loader.hide();
        renderEmptySearch(refs.filmsList);
        return;
      }

      movies = storage.searchMovie;
    }

    if (refs.headerEl.classList.contains('header-lib')) return;

    renderMainPage(movies);
    storage.movies.push(...movies);

    if (movies.length < 20 || tmdbApi.trendingPage > tmdbApi.trendingTotalPage) {
      Notify.info(`That's all`);
      return;
    }

    const triggeredLoadMoreElement = document.querySelector(
      '.products__cards-item:nth-last-child(4) img',
    );

    if (triggeredLoadMoreElement) triggeredLoadMoreElement.addEventListener('load', onLoad);

    function onLoad() {
      if (triggeredLoadMoreElement) triggeredLoadMoreElement.removeEventListener('load', onLoad);
      if (refs.headerEl.classList.contains('header-lib')) return;

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
      authApi.signInWithEmailAndPassword(
        email,
        password,
        user => {
          onSignInSuccess(user);
          modalInstance.close();
        },
        onSiginInError,
      );
      break;
    case ACTION_TYPE.SIGN_UP_WiTH_EMAIL_AND_PASSWORD:
      authApi.createUserWithEmailAndPassword(
        email,
        password,
        user => {
          onSignInSuccess(user);
          modalInstance.close();
        },
        onSiginInError,
      );
      break;
    case ACTION_TYPE.SIGN_IN_WITH_GOOGLE:
      authApi.signInWithGoogle(user => {
        onSignInSuccess(user);
        modalInstance.close();
      }, onSiginInError);
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
  // console.log('You are not signed in');
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
  databaseApi.get('watched', storage.userId, onChangeWatched);
}

function addListenerOnQueueFB() {
  databaseApi.get('queue', storage.userId, onChangeQueue);
}
// колбекs щоб відмалювати додані ФБ
function onChangeWatched(movieList) {
  storage.watched = [...movieList];

  if (
    refs.headerEl.classList.contains('header-lib') &&
    refs.watchedBtn.classList.contains('current-button')
  ) {
    refs.filmsList.innerHTML = '';
    storage.watched.length ? renderMainPage(storage.watched) : renderEmptyList(refs.filmsList);
  }

  return;
}

function onChangeQueue(movieList) {
  storage.queue = [...movieList];

  if (
    refs.headerEl.classList.contains('header-lib') &&
    refs.queueBtn.classList.contains('current-button')
  ) {
    refs.filmsList.innerHTML = '';
    storage.queue.length ? renderMainPage(storage.queue) : renderEmptyList(refs.filmsList);
  }

  return;
}
