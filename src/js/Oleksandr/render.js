// import TmdbApiService from '../services/tmdb-api';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';
import cardTpl from '~/templates/modal.hbs';
// const films = TmdbApiService.fetchTrendingMovies();
// console.log(films);

const refFilmsList = document.querySelector('.films_list');

export function renderMainPage(movies) {
  const descriptionMarkup = movies
    .map(({ id, title, genre_ids, posterUrl }) => {
      return `<li class="products__cards-item" data-movie-id="${id}">
            <div>

                <img class="img" src="https://image.tmdb.org/t/p/w500/${posterUrl}" >
                <p class="film_title">${title}</p>
                <p class="film_genre">${genre_ids}</p>
            </li>`;
    })
    .join('');

  refFilmsList.insertAdjacentHTML('beforeend', descriptionMarkup);

  const handleClick = event => {
    // if (!event.currentTarget.classList.contains('products__cards-item')) {
    //   return;
    // }
    console.log(event.currentTarget.nodeName);
    const swatch = event.target;
    const cardFilm = swatch.closest('.products__cards-item');
    const rrr = cardFilm.dataset.movieId;

    const film = movies.map(item => item.id);
    const n = Number(rrr);
    if (film.includes(n)) {
      const www = movies.filter(item => item.id === n);

      const markup = cardTpl(...www);

      // console.log(renderCard);
      const modalCard = basicLightbox.create(markup);
      modalCard.show();
    }
  };
  refFilmsList.addEventListener('click', handleClick);
}

// renderMainPage(films);
