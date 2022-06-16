import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';
import cardTpl from '~/templates/modal.hbs';

const refFilmsList = document.querySelector('.films_list');

export function renderMainPage(movies) {
  console.log(movies);
  const descriptionMarkup = movies
    .map(({ id, title, genre_ids, posterUrl }) => {
      return `<li class="products__cards-item" data-movie-id="${id}">
                <img class="img" src="https://image.tmdb.org/t/p/w500/${posterUrl}" >
                <p class="film_title">${title}</p>
                <p class="film_genre">${genre_ids}</p>
            </li>`;
    })
    .join('');

  refFilmsList.insertAdjacentHTML('beforeend', descriptionMarkup);
  // refFilmsList.addEventListener('click', handleClick);
  // function handleClick(event) {
  //   const swatch = event.target;
  //   const cardFilm = swatch.closest('.products__cards-item');
  //   const getMovieId = cardFilm.dataset.movieId;
  //   const movieIdstringToNumber = Number(getMovieId);
  //   const filmId = movies.map(item => item.id);

  //   if (filmId.includes(movieIdstringToNumber)) {
  //     const detailsCard = movies.filter(item => item.id === movieIdstringToNumber);
  //     const markup = cardTpl(...detailsCard);
  //     const modalCard = basicLightbox.create(markup);
  //     modalCard.show();
  //   }
  // }
}
