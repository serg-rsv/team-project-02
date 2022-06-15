const filmsList = document.querySelector('.films_list');

export async function renderMainPage(movies) {
  const descriptionMarkup = movies
    .map(({ id, title, genre_ids, posterUrl }) => {
      return `<li class="products__cards-item" data-movie-id="${id}">
                <img class="img" src="https://image.tmdb.org/t/p/w500/${posterUrl}" >
                <p class="film_title">${title}</p>
                <p class="film_genre">${genre_ids}</p>
            </li>`;
    })
    .join('');
  filmsList.insertAdjacentHTML('beforeend', descriptionMarkup);
}
