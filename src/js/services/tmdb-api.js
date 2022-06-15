const axios = require('axios');

// https://api.themoviedb.org/3/movie/550?api_key={API_KEY}
const BASE_URL = 'https://api.themoviedb.org/3/';
// https://image.tmdb.org/t/p/{file_size}/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
const IMAGE_URL = 'https://image.tmdb.org/t/p/';
const API_KEY = '5ce599886a4c0703a030654068991e03';

// GET
const END_POINTS = {
  // /genre/movie/list
  // https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}&language=en-US
  GENRE_MOVIE: 'genre/movie/list',
  // trending/{media_type}/{time_window}
  // https://api.themoviedb.org/3/trending/all/week?api_key={API_KEY}
  TRENDING: 'trending/',
  // search/movie
  // https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query=batman&page=1&include_adult=false
  SEARCH_MOVIE: 'search/movie',
  // movie/{ movie_id }
  // https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US
  MOVIE_DETAILS: 'movie/',
};

const genres = [];

const LANGUAGES = {
  ENGLISH: 'en-US',
  UKRAINIAN: 'uk-UA',
};

const trending = {
  page: 0,
  totalPages: 1,
  MEDIA_TYPE: 'movie/',
  TIME_WINDOW: 'day',
};

const searchMovie = {
  page: 0,
  totalPages: 1,
};

function getListOfGenres(genresIds) {
  const genreList = [];
  genresIds?.forEach(id => {
    const genre = genres.find(genre => genre.id === id);
    genreList.push(genre.name);
  });

  return genreList;
}

export const tmdbApi = {
  /**
   * повертає поточну сторінку з запиту по трендовим фільмам
   */
  get trendingPage() {
    return trending.page;
  },
  /**
   * повертає загальну кількість сторінок з запиту по трендовим фільмам
   */
  get trendingTotalPage() {
    return trending.totalPages;
  },
  /**
   * повертає поточну сторінку з запиту по назві фільму
   */
  get searchMoviePage() {
    return searchMovie.page;
  },
  /**
   * повертає загальну кількість сторінок з запиту по назві фільму
   */
  get searchMovieTotalPage() {
    return searchMovie.totalPages;
  },
  /**
   * перед новим запитом потрібно скинути значення поточної сторінки трендових фільмів
   */
  resetTrendingPage() {
    trending.page = 0;
  },
  /**
   * перед новим пошуком потрібно скинути значення поточної сторінки фільмів по назві
   */
  resetSearchMoviePage() {
    searchMovie.page = 0;
  },
  /**
   *
   * @returns ініціалізує масив жанрів для фільмів
   */
  fetchGanresMovies() {
    const endPointUrl = BASE_URL + END_POINTS.GENRE_MOVIE;
    const requestParams = {
      api_key: API_KEY,
      language: LANGUAGES.ENGLISH,
    };

    axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      genres.push(...data.genres);
    });
  },
  /**
   *
   * @returns повертає *проміс* в якому масив об'єктів популярних фільмів за день.
   */
  fetchTrendingMovies() {
    const endPointUrl = BASE_URL + END_POINTS.TRENDING + trending.MEDIA_TYPE + trending.TIME_WINDOW;
    const requestParams = {
      api_key: API_KEY,
      page: trending.page + 1,
      language: LANGUAGES.ENGLISH,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      trending.page = page;
      trending.totalPages = total_pages;
      return results.map(
        ({
          id,
          title,
          original_title,
          release_date,
          overview,
          vote_average,
          vote_count,
          poster_path,
          genre_ids,
          popularity,
        }) => {
          return {
            id,
            title,
            original_title,
            releaseYear: release_date && release_date.slice(0, 4),
            overview,
            vote_average,
            vote_count,
            posterUrl: poster_path ? `${IMAGE_URL}w500${poster_path}` : 'place-holder.jpg',
            genres: genre_ids.length === 0 ? ['Other'] : getListOfGenres(genre_ids),
            popularity,
          };
        },
      );
    });
  },

  /**
   *
   * @param {string} query назва фільму для пошуку.
   * @returns повертає *проміс* в якому масив фільмів в назві яких зустрічається query.
   */
  fetchSearchMovie(query) {
    const endPointUrl = BASE_URL + END_POINTS.SEARCH_MOVIE;
    const requestParams = {
      api_key: API_KEY,
      page: searchMovie.page + 1,
      language: LANGUAGES.ENGLISH,
      query,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      searchMovie.page = page;
      searchMovie.totalPages = total_pages;
      return results.map(
        ({
          id,
          title,
          original_title,
          release_date,
          overview,
          vote_average,
          vote_count,
          poster_path,
          genre_ids,
          popularity,
        }) => {
          return {
            id,
            title,
            original_title,
            releaseYear: release_date && release_date.slice(0, 4),
            overview,
            vote_average,
            vote_count,
            posterUrl: poster_path ? `${IMAGE_URL}w500${poster_path}` : 'place-holder.jpg',
            genre_ids: genre_ids.length === 0 ? ['Other'] : getListOfGenres(genre_ids),
            popularity,
          };
        },
      );
    });
  },

  /**
   *
   * @param {number} movieId ідентифікатор фільма в базі данних TMBD
   * @returns повертає *проміс* в якому об'єкт з детальним описом фільму.
   */
  fetchMovieDetails(movieId) {
    const endPointUrl = BASE_URL + END_POINTS.MOVIE_DETAILS + movieId;
    const requestParams = {
      api_key: API_KEY,
      language: LANGUAGES.ENGLISH,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const {
        id,
        title,
        original_title,
        release_date,
        overview,
        vote_average,
        vote_count,
        poster_path,
        genres,
        popularity,
      } = data;
      return {
        id,
        genres,
        title,
        original_title,
        release_date,
        overview,
        popularity,
        vote_average,
        vote_count,
        posterUrl: IMAGE_URL + 'w500' + poster_path,
      };
    });
  },
};
