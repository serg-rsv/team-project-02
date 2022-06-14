// import TmdbApiService from '../services/tmdb-api';

// const films = TmdbApiService.fetchTrendingMovies();

const filmsList = document.querySelector('.films_list');

export async function renderMainPage(movies) {
  await movies.then(movie => {
    const descriptionMarkup = movie
      .map(({ id, title, genre_ids, posterUrl }) => {
        return `<li class="products__cards-item" data-movie-id="${id}">
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
// renderMainPage(films);
