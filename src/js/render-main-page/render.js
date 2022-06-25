import placeHolderUrl from '../../images/poster/poster.jpg';
import cardTpl from '../../templates/modal.hbs';
import { modalCall } from '../modal/modalCall';
import filmCardTpl from '../../templates/filmCard.hbs';

const refFilmsList = document.querySelector('.film-list');

function getShortGenresString(genres) {
  if (genres.length >= 3) {
    const validGenres = genres.slice(0, 2);
    validGenres.push('Other');
    return validGenres;
  }
  return genres;
}

function getValidPosterUrl(posterUrl) {
  return posterUrl ? posterUrl : placeHolderUrl;
}

export function renderMainPage(movies) {
  const descriptionMarkup = movies
    .map(({ id, title, genres, posterUrl, releaseYear, vote_average }) => {
      const genresString = getShortGenresString(genres);
      const validPosterUrl = getValidPosterUrl(posterUrl);
      return filmCardTpl({ id, title, genresString, validPosterUrl, releaseYear });
    })
    .join('');

  refFilmsList.insertAdjacentHTML('beforeend', descriptionMarkup);
}
export function openDetailsCard(detailsCard, selectorCloseBtn) {
  const { posterUrl } = detailsCard;
  const validPosterUrl = getValidPosterUrl(posterUrl);
  detailsCard.posterUrl = validPosterUrl;
  const markup = cardTpl(detailsCard);

  modalCall(markup, selectorCloseBtn);
}
