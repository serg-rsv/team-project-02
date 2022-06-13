import './sass/main.scss';

import { TmdbApiService } from './js/services/tmdb-api';
import { renderMainPage } from './js/Oleksandr/render';
import './js/irina/modal.js';

renderMainPage(TmdbApiService.fetchTrendingMovies());
// =============== Псевдокод ===============

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
  // - получить ссылки на кнопки 'просмотрено' и 'очередь'
  // - на кнопку 'просмотрено'повесить слушатель onWatchedBtnClick
  // - на кнопку 'очередь' повесить слушатель onQueueBtnClick
  // - отрисовать список просмотренных фильмов
}

function onWatchedBtn() {
  // todo
  // - отрисовать список фильмов из очереди
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
}

function onAddQueueBtn(e) {
  // todo
  // - databaseApi.add - добавить в БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на удалить
  // - получить ссылку на кнопку и повесить слушатель
}

function onDelWatchedBtn(e) {
  // todo
  // - databaseApi.delete - удалить из БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на добавить
  // - получить ссылку на кнопку и повесить слушатель
}

function onDelQueueBtn(e) {
  // todo
  // - databaseApi.delete - удалить из БД фаербэйз
  // - вывести уведомление об успешности операции (notiflix)
  // - заменить кнопку на добавить
  // - получить ссылку на кнопку и повесить слушатель
}
