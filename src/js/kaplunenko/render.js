// import * as basicLightbox from 'basiclightbox';
// import 'basiclightbox/src/styles/main.scss';
import cardTpl from '~/templates/modal.hbs';
import { modalCall } from '../modal/modalCall';
import { tmdbApi } from '../services/tmdb-api';
import { databaseApi } from '../services/db';

const refFilmsList = document.querySelector('.films_list');

export function renderMainPage(movies) {
  console.log('renderMainPage -->', movies);
  const descriptionMarkup = movies
    .map(({ id, title, genres, posterUrl, releaseYear, vote_average }) => {
      return `<li class="products__cards-item" data-movie-id="${id}">
                <img class="img" src="${posterUrl}" >
                <p class="film_title">${title}</p>
                <ul class="info-list">
                    <li class="film_genre">${genres.join(', ')}</li>
                    <li class="film_genre">${releaseYear}</li>
                    <li class="film-profile__value--accent film_average">${vote_average}</li>
                </ul>
             </li>`;
    })
    .join('');

  refFilmsList.insertAdjacentHTML('beforeend', descriptionMarkup);
}

export function openDetailsCard(detailsCard, selectorCloseBtn) {
  // refFilmsList.addEventListener('click', handleClick);
  // function handleClick(event) {
  //   const swatch = event.target;
  //   const cardFilm = swatch.closest('.products__cards-item');
  //   const getMovieId = cardFilm.dataset.movieId;
  //   const movieIdstringToNumber = Number(getMovieId);
  //   const filmId = movies.map(item => item.id);

  //   if (filmId.includes(movieIdstringToNumber)) {
  //     const detailsCard = movies.filter(item => item.id === movieIdstringToNumber);
  const markup = cardTpl(detailsCard);
  modalCall(markup, selectorCloseBtn);
  // }
  // }
}

// function genresListCut(array) {
//   const genresList = array.map(({ genres }) => {
//     if (genres.length === 2) {
//       return genres;
//     }
//   });
//   console.log(genresList);
// }
// function onFetchMovieSaveData(movieList, userId) {
//   DATA_FROM_DATABASE = {
//     userId,
//     movieList,
//   };
// }
// console.log(onFetchMovieSaveData());
// const wrt = tmdbApi.fetchTrendingMovies();
// console.log(
//   wrt.then(value => {
//     return value;
//   }),
// );
console.log(databaseApi.get);
