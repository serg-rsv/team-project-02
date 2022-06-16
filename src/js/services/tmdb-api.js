const axios = require('axios');

// https://api.themoviedb.org/3/movie/550?api_key={API_KEY}
const BASE_URL = 'https://api.themoviedb.org/3/';
// https://image.tmdb.org/t/p/{file_size}/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
const IMAGE_URL = 'https://image.tmdb.org/t/p/';
const API_KEY = '5ce599886a4c0703a030654068991e03';

export const TmdbApiService = {
  // GET
  endPoints: {
    // #trending/{media_type}/{time_window}
    // https://api.themoviedb.org/3/#trending/all/week?api_key={API_KEY}
    trending: 'trending/',
    // search/movie
    // https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query=batman&page=1&include_adult=false
    searchMovie: 'search/movie',
    // movie/{ movie_id }
    // https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US
    movieDetails: 'movie/',
    // https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}&language=en-US
    genresMovie: 'genre/movie/list',
  },

  languages: {
    ENGLISH: 'en',
    UKRAINIAN: 'uk',
  },

  trending: {
    page: 0,
    totalPages: 1,
    mediaType: 'movie/',
    timeWindow: 'day',
  },

  searchMovie: {
    page: 0,
    totalPages: 1,
  },

  getTrendingPage: function () {
    return this.trending.page;
  },

  getTrendingTotalPage: function () {
    return this.trending.totalPages;
  },

  getSearchMoviePage: function () {
    return this.searchMovie.page;
  },

  getSearchMovieTotalPage: function () {
    return this.searchMovie.totalPages;
  },

  resetTrendingPage: function () {
    this.trending.page = 0;
  },

  resetSearchMoviePage: function () {
    this.searchMovie.page = 0;
  },
  /**
   *
   * @returns повертає *проміс* в якому масив об'єктів популярних фільмів за день.
   */
  fetchTrendingMovies: function (place) {
    console.log('I am fetched here:>>', place);
    const endPointUrl =
      BASE_URL + this.endPoints.trending + this.trending.mediaType + this.trending.timeWindow;
    const requestParams = {
      api_key: API_KEY,
      page: this.trending.page + 1,
      language: this.languages.ENGLISH,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      this.trending.page = page;
      this.trending.totalPages = total_pages;
      return results.map(result => {
        const { id, title, vote_average, release_date, poster_path, genre_ids } = result;
        return {
          id,
          genre_ids,
          title,
          vote_average,
          releaseYear: release_date.slice(0, 4),
          posterUrl: IMAGE_URL + 'w500' + poster_path,
        };
      });
    });
  },

  /**
   *
   * @param {string} query назва фільму для пошуку.
   * @returns повертає *проміс* в якому масив фільмів в назві яких зустрічається query.
   */
  fetchSearchMovie: function (query) {
    const endPointUrl = BASE_URL + this.endPoints.searchMovie;
    const requestParams = {
      api_key: API_KEY,
      page: this.searchMovie.page + 1,
      language: this.languages.ENGLISH,
      query,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      if (total_pages === 0) {
        throw new Error('Movies not found :(');
      }
      this.searchMovie.page = page;
      this.searchMovie.totalPages = total_pages;
      return results.map(result => {
        const { id, title, vote_average, release_date, poster_path, genre_ids } = result;
        return {
          id,
          genre_ids,
          title,
          vote_average,
          releaseYear: release_date.slice(0, 4),
          posterUrl: IMAGE_URL + 'w500' + poster_path,
        };
      });
    });
  },

  /**
   *
   * @param {number} movieId ідентифікатор фільма в базі данних TMBD
   * @returns повертає *проміс* в якому об'єкт з детальним описом всіх характеристик фільму.
   */
  fetchMovieDetails: function (movieId) {
    const endPointUrl = BASE_URL + this.endPoints.movieDetails + movieId;
    const requestParams = {
      api_key: API_KEY,
      language: this.languages.ENGLISH,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const {
        id,
        title,
        original_title,
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
        overview,
        popularity,
        vote_average,
        vote_count,
        posterUrl: IMAGE_URL + 'w500' + poster_path,
      };
    });
  },
};
