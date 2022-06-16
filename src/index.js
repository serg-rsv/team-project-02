import './sass/main.scss';

import _ from 'lodash';

import { tmdbApi } from './js/services/tmdb-api';
import { renderMainPage } from './js/kaplunenko/render';
import { autorisationFormCall } from './js/form/autorizaton-modal-call';
import { autorizationFormUiValid } from './js/form/form-ui-valid';
import { homeRender, libraryRender } from './js/header/change-header';
import { loadMore } from './js/iffinity-render/infinityRender';
import { modalCall } from './js/modal/modalCall';

import './js/irina/modal.js';
import './js/Fedorenko/team-modal';
import { authApi } from './js/services/auth';
import { databaseApi } from './js/services/db';
import { Notify } from 'notiflix';

const refs = {
  homeBtn: document.querySelectorAll('[data-load="home"]'),
  libraryBtn: document.querySelector('[data-load="library"]'),
  filmsList: document.querySelector('.films_list'),
  searchInput: document.querySelector('#name-input'),
  watchedBtn: document.querySelector('[data-action="watched"]'),
  queueBtn: document.querySelector('[data-action="queue"]'),
};

const storage = {
  userId: null,
  isSingIn: false,
  watched: [],
  queue: [],
  movies: [],
};

// перелік єкшенів в submit інпутах форми, щоб зе робити помилку
const ACTION_TYPE = {
  SIGN_IN_WITH_EMAIL_AND_PASSWORD: 'sign-in-with-email-password',
  SIGN_UP_WiTH_EMAIL_AND_PASSWORD: 'sign-up-with-email-password',
  SIGN_IN_WITH_GOOGLE: 'sign-in-with-google-account',
};

async function launch() {
  // =============== Prokoptsov ===================//
  // визначаємо чи залогінений юзер у системі при завантаженні сторінки та виконуємо логіку у колбеках
  authApi.trackUserLoginState(userIsSignedIn, userIsSignedOut)
  // =================================================
  tmdbApi.fetchGenresMovies();

  const movies = await tmdbApi.fetchTrendingMovies();
  storage.movies.push(...movies);

  renderMainPage(movies);
}

launch();

refs.homeBtn.forEach(btn => btn.addEventListener('click', onHomeBtn));
refs.libraryBtn.addEventListener('click', onLibBtn);
refs.searchInput.addEventListener('input', _.debounce(onSearchInput, 350));
refs.watchedBtn.addEventListener('click', onWatchedBtn);
refs.queueBtn.addEventListener('click', onQueueBtn);

// =============== Псевдокод ===============

// authApi.trackUserLoginState() ----> ункція має викликатися найпершою
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
// const refs = {
//   filmsList: document.querySelector('.films_list'),
//   homeBtns: document.querySelectorAll('[data-load="home"]'),
//   searchInput: document.querySelector('input'),
//   libBtn: document.querySelector('[data-load="library"]'),
//   watchedBtn,
//   queueBtn,
//   addWatchedBtn,
//   addQueueBtn,
//   delWatchedBtn,
//   delQueueBtn,
// };

// возможно для уменьшения количества запросов на сервера с БД
// создать в памяти структуру для хранения информации по фильмам что-то вроде такого
// const storage = {
//   userId, // хранит uid пользователя.
//   watchedList, // массив просмотренных фильмов которые обновляються при добавлении удалении фильмов из ФБ
//   queueList,
//   trendingList, // массив для отображения на главной
// };

// refs.homeBtns.forEach(btn => btn.addEventListener('click', onHomeBtn));
// refs.libBtn.addEventListener('click', onLibBtn);
// refs.searchInput.addEventListener('input', _.debounce(onSearchInput, 300));
// refs.filmsList.addEventListener('click', onMovieCard);

function onHomeBtn() {
  // todo
  // - отрисовать шапку главной страницы (вспомагательная функция для рендера - Таня)
  homeRender();
  // - отрисовать галерею трендовых фильмов в мэйн (renderMainPage - Саша)
  refs.filmsList.innerHTML = '';
  renderMainPage(storage.movies);
}

async function onSearchInput(e) {
  // todo
  const query = e.target.value.trim();
  // - проверить что запрос не пустая строка
  if (query === '') {
    return;
  }

  tmdbApi.resetSearchMoviePage();
  const movies = await tmdbApi.fetchSearchMovie(query);
  if (movies) storage.movies.push(...movies);
  // - если ничего не найдено по запросу
  //  - вывести уведомление 'Search result not successful. Enter the correct movie name and try again'
  if (tmdbApi.searchMovieTotalPage === 0) {
    Notify.info('Search result not successful. Enter the correct movie name and try again.');
  } else {
    // - отрисовать список фильмов по данным от ТМДБ
    refs.filmsList.innerHTML = '';
    renderMainPage(movies);
  }
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
function onWatchedBtn() {
  // todo
  // - отрисовать список фильмов из очереди
  if (storage.watched) {
    refs.filmsList.innerHTML = '';
    renderMainPage(storage.watched);
  }
  refs.filmsList.innerHTML = '<h2>Your list of watched is empty.</h2>';
}

function onQueueBtn() {
  // todo
  // - отрисовать список фильмов из очереди
  if (storage.queue) {
    refs.filmsList.innerHTML = '';
    renderMainPage(storage.queue);
  }
  refs.filmsList.innerHTML = '<h2>Your list of queue is empty.</h2>';
}

function onMovieCard(e) {
  // todo
  // - проверить что клик именно по карточке фильма
  // - создать модальное окно
  // - получить детальную информацию от ТМДБ
  // - databaseApi.check - проверить наличие этого фильма в фаербэйз в просмотренных и в очередеи
  // - отрисовать модалку с детальной информацией по фильму
  //  - отрисовать кнопки соответсвенно добавить/удалить
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

// ================== Prokoptsov =================//
// оброблює реєстрацію та логін
function onAuthFormClick(e) {
  e.preventDefault();
  
  const action = e.target.parentElement.name;
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;

  switch (action) {
    case ACTION_TYPE.SIGN_IN_WITH_EMAIL_AND_PASSWORD:
      authApi.signInWithEmailAndPassword(email, password, onSignInSuccess, onSiginInError)
      break;
    case ACTION_TYPE.SIGN_UP_WiTH_EMAIL_AND_PASSWORD:
      authApi.createUserWithEmailAndPassword(email, password, onSignInSuccess, onSiginInError)
      break;
    case ACTION_TYPE.SIGN_IN_WITH_GOOGLE:
      authApi.signInWithGoogle(onSignInSuccess, onSiginInError)
      break;
    default: return;
  };

  e.currentTarget.reset();
}
// колбек для databaseApi.add(), щоб відмалювати додані до ФБ вільми
function onGetMoviesFromFirebase (movieList) {
  console.log(movieList);
  refs.filmsList.innerHTML = '';
  movieList.length ? renderMainPage(movieList) : refs.filmsList.insertAdjacentHTML('beforeend', '<p>Nothing has been added here yet</p>');
}
// колбек на випадок успіщноїї реєстрації та успішного логіну
function onSignInSuccess (user) {
  storage.userId = user.uid;
  storage.isSingIn = true;
  getAndRenderMovies('watched');

}
// колбек на випадок, коли юзер вже залогінений при завантаженні сторінки
function userIsSignedIn (user) {
  storage.userId = user.uid;
  storage.isSingIn = true;

  Notify.info(`Welcome, ${user.email}`);
}

// колбек на вилогінювання юзера
function userIsSignedOut () {
  console.log('You are not signed in')
}

// колбек для обробки помилки при запиті.
function onSiginInError (error) {
  // нормалізує повідомлення помилки з ФБ
  const indexOfSlash = error.code.indexOf('/');
  const nomalizedErrorMessage = error.code.slice(indexOfSlash + 1)[0].toUpperCase() + error.code.slice(indexOfSlash + 2).replaceAll('-', ' ');
  
  Notify.failure(`Ups... ${nomalizedErrorMessage}`);
}
// робить запити до ФБ і стягує фільми відповідно до переданого шляху
/**
 * @param {String} path // директорія у ФБ
 */
function getAndRenderMovies (path) {
  databaseApi.get(path, storage.userId, onGetMoviesFromFirebase);
}
// ===============================================//