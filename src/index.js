import './sass/main.scss';

import Hello from './js/test';
// commit test
import './js/input-search';


import { TmdbApiService } from './js/services/tmdb-api';
import { renderMainPage } from './js/Oleksandr/render';
import './js/irina/modal.js';

renderMainPage(TmdbApiService.fetchTrendingMovies());

