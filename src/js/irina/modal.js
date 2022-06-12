import { TmdbApiService } from '../services/tmdb-api';
import filmDetailsModal from '~/templates/modal.hbs';

export default function onOpenModal(movieId) {
  const detailsOfFilm = TmdbApiService.fetchMovieDetails(movieId);
  detailsOfFilm.then(film => {
    const markup = filmDetailsModal(film);
  });
}
