import TmdbApiService from '../tmdb-api'

const films = TmdbApiService.fetchTrendingMovies();



const filmsList = document.querySelector('.films_list');
const API_KEY = '5ce599886a4c0703a030654068991e03'

// const fetchTrendfilms = () => {
//     return fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`).then(r => r.json());
// }

async function renderMainPage(movies) {
//    const movies = films.results
    let descriptionMarkup;
    await movies.then(movie => {
         descriptionMarkup = movie.map(({ title, genre_ids, posterUrl }) => {
            return ` <li class="products__cards-item">
        
            <div>
                <img class="img" src="https://image.tmdb.org/t/p/w500/${posterUrl}" >
                <p class="film_title">${title}</p>
                <p class="film_genre">${genre_ids}</p>
            </div>
            </li>`
        }).join('');
    });
    filmsList.innerHTML = descriptionMarkup;
}
renderMainPage(films)
// function renderMainPage(films) {
//     console.log(films.results)
// }


// fetchTrendfilms().then(renderMainPage)