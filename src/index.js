import './sass/main.scss';
// import TmdbApiService from './js/services/tmdb-api';

// TmdbApiService.fetchTrendingMovies().then(JSON.stringify).then(console.log);
// TmdbApiService.fetchSearchMovie('batman').then(JSON.stringify).then(console.log);
// TmdbApiService.fetchMovieDetails(414906).then(JSON.stringify).then(console.log);

import loader from './js/loader/loader';

loader.hide();
loader.show(document.body);

