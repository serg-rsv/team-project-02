import TmdbApiService from '../tmdb-api';

const films = TmdbApiService.fetchTrendingMovies();

const filmsList = document.querySelector('.films_list');

async function renderMainPage(movies) {
  await movies.then(movie => {
    const descriptionMarkup = movie
      .map(({ title, genre_ids, posterUrl }) => {
        return `<li class="products__cards-item">
            <div>
                <img class="img" src="https://image.tmdb.org/t/p/w500/${posterUrl}" >
                <p class="film_title">${title}</p>
                <p class="film_genre">${genre_ids}</p>
            </div>
            </li>`;
      })
      .join('');
    filmsList.innerHTML = descriptionMarkup;
  });
}
renderMainPage(films);
