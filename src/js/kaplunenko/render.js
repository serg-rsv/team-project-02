// import * as basicLightbox from 'basiclightbox';
// import 'basiclightbox/src/styles/main.scss';
import cardTpl from '~/templates/modal.hbs';
import { modalCall } from '../modal/modalCall';
import { tmdbApi } from '../services/tmdb-api';

const refFilmsList = document.querySelector('.films_list');

function getShortGenresString(arrayGenres) {
  if (arrayGenres.length <= 2) {
    return arrayGenres.join(', ');
  } else {
    const shortGener = arrayGenres.slice(0, 2);
    shortGener.push('Other');
    return shortGener.join(', ');
  }
}

export function renderMainPage(movies) {
  const descriptionMarkup = movies
    .map(({ id, title, genres, posterUrl, releaseYear, vote_average }) => {
      const genresString = getShortGenresString(genres);
      return `<li class="products__cards-item" data-movie-id="${id}">
                <img class="img" src="${posterUrl}" >
                <p class="film_title">${title}</p>
                <ul class="info-list">
                    <li class="film_genre">${genresString}</li>
                    <li class="film_genre">${releaseYear}</li>
                    <li class="film-profile__value--accent film_average">${vote_average}</li>
                </ul>
             </li>`;
    })
    .join('');

  refFilmsList.insertAdjacentHTML('beforeend', descriptionMarkup);
}

export function openDetailsCard(detailsCard, selectorCloseBtn) {
  const markup = cardTpl(detailsCard);
  modalCall(markup, selectorCloseBtn);
}
