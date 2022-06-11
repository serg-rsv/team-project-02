import TmdbApiService from '../services/tmdb-api';
import filmDetails from '~/templates/modal.hbs'

const body = document.querySelector('body');

const detailsOfFilm = TmdbApiService.fetchMovieDetails(414906);
detailsOfFilm.then(film => {
    const markup = filmDetails(film);
    body.insertAdjacentHTML('beforeend', markup)
});

