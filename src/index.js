import './sass/main.scss';

import { TmdbApiService } from './js/services/tmdb-api';
import { renderMainPage } from './js/Oleksandr/render';

import './js/irina/modal.js';
import './js/header/change-header';
// import { authApi } from './js/services/auth';
import './js/form/form-ui-valid'

renderMainPage(TmdbApiService.fetchTrendingMovies());

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
// const dataModel = {
//   currentUser, // хранит uid пользователя.
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
  // - отрисовать галерею трендовых фильмов в мэйн (renderMainPage - Саша)
  // - получить ссылку на 'поле ввода' и повесить слушатель onSearchInput
}

function onSearchInput(e) {
  // todo
  // - проверить что длина значения запроса > 0 или не равно пустой строке
  // - если ничего не найдено по запросу
  //  - вывести уведомление 'Search result not successful. Enter the correct movie name and try again'
  // - отрисовать список фильмов по данным от ТМДБ
}

function onLibBtn() {
  // todo
  // - отрисовать шапку библиотеки
  // - проверка на авторизацию 
  //  - если не авторизован
  //    - отрисовать форму регистрации/авторизации
  //    - получить ссылку на форму и повесить обработчик событий для регистрации/авторизации
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
  // - получить ссылки на кнопки 'просмотрено' и 'очередь'
  // - на кнопку 'просмотрено'повесить слушатель onWatchedBtnClick
  // - на кнопку 'очередь' повесить слушатель onQueueBtnClick
  // - отрисовать список просмотренных фильмов
  // ========== Prokoptsov.
  // ще пропоную видаляти слухачі після того, як юзер перейшов на вкладку HOME
  // те саме пропоную робити, коли юзер пішов з вкалдки HOME та натиснув вкалдку MyLibrary
}

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
  // 
}

function onQueueBtn() {
  // todo
  // - отрисовать список фильмов из очереди
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