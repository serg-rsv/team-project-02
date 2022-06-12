import TmdbApiService from '../services/tmdb-api';
import filmDetails from '~/templates/modal.hbs'

// const body = document.querySelector('body');

export default function onOpenModal(movieId) {
    const detailsOfFilm = TmdbApiService.fetchMovieDetails(movieId);
detailsOfFilm.then(film => {
    const markup = filmDetails(film);
    // body.insertAdjacentHTML('beforeend', markup);
});
};


