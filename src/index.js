import './sass/main.scss';




import { TmdbApiService } from './js/services/tmdb-api';
import { renderMainPage } from './js/Oleksandr/render';
import './js/irina/modal.js';
import './js/Ivan/input-search';
renderMainPage(TmdbApiService.fetchTrendingMovies());

