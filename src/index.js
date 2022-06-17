// =============== Taras ===============>
const testW = [
  {
    id: 705861,
    genres: ['Action', 'Drama'],
    title: 'Hustle',
    vote_average: 7.4,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fVf4YHHkRfo1uuljpWBViEGmaUQ.jpg',
  },
  {
    id: 648579,
    genres: ['Action', 'Drama'],
    title: 'The Unbearable Weight of Massive Talent',
    vote_average: 7.4,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bmxCAO0tz79xn40swJAEIJPRnC1.jpg',
  },
  {
    id: 507086,
    genres: ['Action', 'Drama'],
    title: 'Jurassic World Dominion',
    vote_average: 6.8,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg',
  },
];
const testQ = [
  {
    id: 507086,
    genres: ['Action', 'Drama'],
    title: 'Jurassic World Dominion',
    vote_average: 6.8,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg',
  },
  {
    id: 648579,
    genres: ['Action', 'Drama'],
    title: 'The Unbearable Weight of Massive Talent',
    vote_average: 7.4,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bmxCAO0tz79xn40swJAEIJPRnC1.jpg',
  },
];
// <============== Taras ===============
import './sass/main.scss';

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

const refs = {
  homeBtns: document.querySelectorAll('[data-load="home"]'),
  libraryBtn: document.querySelector('[data-load="library"]'),
  filmsList: document.querySelector('.films_list'),
  searchInput: document.querySelector('#name-input'),
  watchedBtn: document.querySelector('[data-action="watched"]'),
  queueBtn: document.querySelector('[data-action="queue"]'),
  teamLnk: document.querySelector('.js-team-link'),
};

const storage = {
  userId: null,
  isSingIn: false,
  watched: testW, // тут будуть зберігатись данні з ФБ ,
  queue: testQ, //тут будуть зберігатись данні з ФБ ,
  movies: [], // сюди записуємо об'єкти фільмів які відрендерили на екрані
  currentTab: '', // для перемикання між кнопками watched & queue
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
  const movies = await infinityScrollData();
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

// =============== Псевдокод ===============

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

// список интерактивных елементов
// static:
//   filmsList,
//   homeBtns,
//   searchInput,
//   libBtn,
//   watchedBtn,
//   queueBtn,
// dynamic:
//   addWatchedBtn,
//   addQueueBtn,
//   delWatchedBtn,
//   delQueueBtn,
//   ... @Діма кнопки форми авторирзації на твій розсуд
// };

// =============== Sveta ===============>
function onTeamLnk() {
  showTeamModal();
}
// <============== Sveta ===============

function onHomeBtn() {
  // todo
  // - отрисовать шапку главной страницы (вспомагательная функция для рендера - Таня)
  homeRender();
  // - отрисовать галерею трендовых фильмов в мэйн (renderMainPage - Саша)
  // {show loader}
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
  // // - если ничего не найдено по запросу
  // //  - вывести уведомление 'Search result not successful. Enter the correct movie name and try again'
  if (tmdbApi.searchMovieTotalPage === 0) {
    Notify.warning('Search result not successful. Enter the correct movie name and try again.');
    return;
  }

  refs.filmsList.innerHTML = '';

  tmdbApi.resetSearchMoviePage();
  infinityScrollData(query);
}

function onLibBtn() {
  // todo
  // - отрисовать шапку библиотеки
  libraryRender();

  // - проверка на авторизацию
  //  - если не авторизован
  //    - отрисовать форму регистрации/авторизации
  //    - получить ссылку на форму и повесить обработчик событий для регистрации/авторизации
  if (!storage.userId) {
    autorisationFormCall();
    autorizationFormUiValid();
    // ================= Prokoptsov ===========/
    // пілся появи форми знаходимо її у DOM
    const formRef = document.querySelector('[data-js="auth-form"]');
    // вішаємо слухач, та додаємо обробник подіїї
    formRef.addEventListener('click', onAuthFormClick);
  }

  getAndRenderMovies('watched');
  // ===================================//
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
  // - на кнопку 'просмотрено'повесить слушатель onWatchedBtn
  // - на кнопку 'очередь' повесить слушатель onQueueBtn
  // - отрисовать список просмотренных фильмов
  // ========== Prokoptsov.
  // ще пропоную видаляти слухачі після того, як юзер перейшов на вкладку HOME
  // те саме пропоную робити, коли юзер пішов з вкалдки HOME та натиснув вкалдку MyLibrary
}

// =======================================================//

// ========= Prokoptsov =======
// Такий ще момент: коли натискаємо на будь-яку кнопку, яка виконую запит
// чи то до TMDB чи до Firebase треба РОБИТИ КНОПКИ НЕАКТИВНИМИ!!!!
// і в середені вставити спінер маленький.
// А по закінчені запиту незалежно від результата запиту
// ВМИКАТИ КНОПКИ ТА ПРИБИРАТИ СПІНЕР
// типу
// (e) => {
// const button = e.target;
// button.disable = true;
//  запит..... .then(data => {
//      щось робимо за даними
//  }).finally(() => button.disable = false;)
// }
// =========================

// =============== Taras ===============>
function onWatchedBtn() {
  // todo
  // - завантаження списку watched і рендер
  if (storage.watched) {
    refs.filmsList.innerHTML = '';
    renderMainPage(storage.watched);
  } else {
    // - повідомлення про пустий список
    refs.filmsList.innerHTML = '<h2>Your list of watched is empty.</h2>';
  }
}

function onQueueBtn() {
  // todo
  // - завантаження списку queue і рендер
  if (storage.queue) {
    refs.filmsList.innerHTML = '';
    renderMainPage(storage.queue);
  } else {
    // - повідомлення про пустий список
    refs.filmsList.innerHTML = '<h2>Your list of queue is empty.</h2>';
  }
}
// ------------------------------
function onGetWatchedMovieRender() {
  destroyMovieList(); // очищаємо розмітку;
  const watchedMovieArray = storage[storage.currentTab]; //тут має бути список фільмів(watched або queue- значення зберігається в змінній currentTab)
  renderMainPage(watchedMovieArray);
}

// ---------------------
function destroyMovieList() {
  refs.filmsList.innerHTML = '';
}
// -------------------------------------
function onNavigate(event) {
  const currentTab = event.target.dataset.action;

  if (storage.currentTab !== currentTab) {
    // console.log(storage);
    // console.log(storage.currentTab);
    storage.currentTab = currentTab;
    toggleButtons(currentTab);

    // databaseApi.get(currentTab, store.userId, onGetWatchedMovieRender);
    onGetWatchedMovieRender();
  }
}
/**
 * ф-я перемикає стан кнопок: disabled/ enabled. та присвоює/видаляє клас, щоб підсвітити активну кнопку;
 * @param {де саме був клік} currentTab
 */
function toggleButtons(currentTab) {
  if (currentTab === 'watched') {
    refs.watchedBtn.classList.add('current-button');
    refs.queueBtn.classList.remove('current-button');
    refs.queueBtn.disabled = false; // потрібно вирішити, чи будемо дізаблити ці кнопки
    refs.watchedBtn.disabled = true; // бо натиснути їх можна лише раз. Можливо як додатково UI для юзера?
  }
  if (currentTab === 'queue') {
    refs.queueBtn.classList.add('current-button');
    refs.watchedBtn.classList.remove('current-button');
    refs.queueBtn.disabled = true;
    refs.watchedBtn.disabled = false;
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
  const movieData = storage.movies.find(movie => movie.id === movieId);
  // console.log(movieData);
  // - создать модальное окно
  openDetailsCard(movieData, '.form_close-button');
  // - databaseApi.check - проверить наличие этого фильма в фаербэйз в просмотренных и в очередеи
  // - отрисовать модалку с детальной информацией по фильму
  // - отрисовать кнопки соответсвенно добавить/удалить
  // - получить ссылки на кнопки 'add/del to watched' и 'add/del to queue' и повесить слушатели
}

function onAddWatchedBtn(e) {
  // todo
  // - databaseApi.add - добавить в БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на удалить
  // - получить ссылку на кнопку и повесить слушатель
  // ============== Prokoptsov ============
  // databaseApi.add повертає проміс, тому у коді можна зачейнити then і catch
  //  databaseApi.add().then(вывести уведомление об успешности операции (notiflix))
  //                    .catch(вывести уведомление об НЕ успешности операции (notiflix))
  // ===================================
}

function onAddQueueBtn(e) {
  // todo
  // - databaseApi.add - добавить в БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на удалить
  // - получить ссылку на кнопку и повесить слушатель
  // ============== Prokoptsov ============
  // databaseApi.add повертає проміс, тому у коді можна зачейнити then і catch
  //  databaseApi.add().then(вывести уведомление об успешности операции (notiflix))
  //                    .catch(вывести уведомление об НЕ успешности операции (notiflix))
  // ===================================
}

function onDelWatchedBtn(e) {
  // todo
  // - databaseApi.delete - удалить из БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на добавить
  // - получить ссылку на кнопку и повесить слушатель
  // ============== Prokoptsov ============
  // databaseApi.delete повертає проміс, тому у коді можна зачейнити then і catch
  //  databaseApi.delete().then(вывести уведомление об успешности операции (notiflix))
  //                    .catch(вывести уведомление об НЕ успешности операции (notiflix))
  // ===================================
}

function onDelQueueBtn(e) {
  // todo
  // - databaseApi.delete - удалить из БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на добавить
  // - получить ссылку на кнопку и повесить слушатель
  // ============== Prokoptsov ============
  // databaseApi.delete повертає проміс, тому у коді можна зачейнити then і catch
  //  databaseApi.delete().then(вывести уведомление об успешности операции (notiflix))
  //                    .catch(вывести уведомление об НЕ успешности операции (notiflix))
  // ===================================
}

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
  try {
    let movies;
    if (!query) {
      movies = await tmdbApi.fetchTrendingMovies();
    }
    if (query) {
      movies = await tmdbApi.fetchSearchMovie(query);
    }
    renderMainPage(movies);
    storage.movies.push(...movies);
    if (movies.length < 20 || tmdbApi.trendingPage > tmdbApi.trendingTotalPage) return;
    const triggeredLoadMoreElement = document.querySelector(
      '.products__cards-item:nth-last-child(4) img',
    );
    triggeredLoadMoreElement.addEventListener('load', onLoad);
    function onLoad() {
      triggeredLoadMoreElement.removeEventListener('load', onLoad);
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

  observer.observe(document.querySelector(selector));
}
// <============== Niko ===============

// ================== Prokoptsov =================//
// оброблює реєстрацію та логін
function onAuthFormClick(e) {
  e.preventDefault();

  const action = e.target.parentElement.name;
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;

  switch (action) {
    case ACTION_TYPE.SIGN_IN_WITH_EMAIL_AND_PASSWORD:
      authApi.signInWithEmailAndPassword(email, password, onSignInSuccess, onSiginInError);
      break;
    case ACTION_TYPE.SIGN_UP_WiTH_EMAIL_AND_PASSWORD:
      authApi.createUserWithEmailAndPassword(email, password, onSignInSuccess, onSiginInError);
      break;
    case ACTION_TYPE.SIGN_IN_WITH_GOOGLE:
      authApi.signInWithGoogle(onSignInSuccess, onSiginInError);
      break;
    default:
      return;
  }

  e.currentTarget.reset();
}
// колбек для databaseApi.add(), щоб відмалювати додані до ФБ вільми
function onGetMoviesFromFirebase(movieList) {
  console.log(movieList);
  refs.filmsList.innerHTML = '';
  movieList.length
    ? renderMainPage(movieList)
    : refs.filmsList.insertAdjacentHTML('beforeend', '<p>Nothing has been added here yet</p>');
}
// колбек на випадок успіщноїї реєстрації та успішного логіну
function onSignInSuccess(user) {
  storage.userId = user.uid;
  storage.isSingIn = true;
  getAndRenderMovies('watched');
}
// колбек на випадок, коли юзер вже залогінений при завантаженні сторінки
function userIsSignedIn(user) {
  storage.userId = user.uid;
  storage.isSingIn = true;

  Notify.info(`Welcome, ${user.email}`);
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
// робить запити до ФБ і стягує фільми відповідно до переданого шляху
/**
 * @param {String} path // директорія у ФБ
 */
function getAndRenderMovies(path) {
  databaseApi.get(path, storage.userId, onGetMoviesFromFirebase);
}
// ===============================================//
