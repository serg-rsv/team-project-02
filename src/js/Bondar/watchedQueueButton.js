import { databaseApi } from '..Prokoptsov/databaseApi';

//onGetWatchedMovieRender ---> колбек-функція, яка після відповіді від FireBase
// буде рендерети масив доданих фільмів.

// завантажує список додадних фільмів
const test = [
  {
    id: 705861,
    genre_ids: [18, 35],
    title: 'Hustle',
    vote_average: 7.4,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fVf4YHHkRfo1uuljpWBViEGmaUQ.jpg',
  },
  {
    id: 648579,
    genre_ids: [28, 35, 80],
    title: 'The Unbearable Weight of Massive Talent',
    vote_average: 7.4,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/bmxCAO0tz79xn40swJAEIJPRnC1.jpg',
  },
  {
    id: 507086,
    genre_ids: [878, 28, 12, 53],
    title: 'Jurassic World Dominion',
    vote_average: 6.8,
    releaseYear: '2022',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg',
  },
];

const filmsList = document.querySelector('.films_list');
const store = {
  currentTab: '',
};
const WatchedButton = document.querySelector('[data-action="watched"]');
const queueButton = document.querySelector('[data-action="queue"]');

console.log(WatchedButton);
WatchedButton.addEventListener('click', onNavigate);
queueButton.addEventListener('click', onNavigate);

function onWatchedBtn(event) {
  // - отправить запрос get и получить список просмотренных фильмов;
  // - проверить список на наличие фильмов;
  // - отрисовать список фильмов из очереди;
  // - или сообщить о том что фильмов в списке нет;
  // console.log(event.target);
}
function onGetWatchedMovieRender(watchedMovieArray = test) {
  destroyMovieList();
  renderMainPage(watchedMovieArray);
}
// WatchedButton.addEventListener('click', onWatchedBtn);

function onNavigate(event) {
  const currentTab = event.target.dataset.action;

  if (store.currentTab !== currentTab) {
    console.log(store);
    store.currentTab = currentTab;
    // databaseApi.get(currentTab, store.userId, onGetWatchedMovieRender);
    onGetWatchedMovieRender();
  }
}
function destroyMovieList() {
  filmsList.innerHTML = '';
}
