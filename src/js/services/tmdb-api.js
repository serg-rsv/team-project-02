const axios = require('axios');

// https://api.themoviedb.org/3/movie/550?api_key={API_KEY}
const BASE_URL = 'https://api.themoviedb.org/3/';
// https://image.tmdb.org/t/p/{file_size}/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
const IMAGE_URL = 'https://image.tmdb.org/t/p/';
const API_KEY = '5ce599886a4c0703a030654068991e03';

export default class TmdbApiService {
  // GET
  static #endPoints = {
    // trending/{media_type}/{time_window}
    // https://api.themoviedb.org/3/trending/all/week?api_key={API_KEY}
    trending: 'trending/',
    // search/movie
    // https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&language=en-US&query=batman&page=1&include_adult=false
    searchMovie: 'search/movie',
    // movie/{ movie_id }
    // https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US
    movieDetails: 'movie/',
    // https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}&language=en-US
    genresMovie: 'genre/movie/list',
  };

  static #languages = {
    ENGLISH: 'en',
    UKRAINIAN: 'uk',
  };

  static #trending = {
    page: 0,
    totalPages: 1,
    mediaType: 'movie/',
    timeWindow: 'day',
  };

  static #searchMovie = {
    page: 0,
    totalPages: 1,
  };

  static getTrandingPage() {
    return this.#trending.page;
  }

  static getTrandingTotalPage() {
    return this.#trending.totalPages;
  }

  static getSearchMoviePage() {
    return this.#searchMovie.page;
  }

  static getSearchMovieTotalPage() {
    return this.#searchMovie.totalPages;
  }

  static resetTrendingPage() {
    this.#trending.page = 0;
  }

  static resetSearchMoivePage() {
    this.#searchMovie.page = 0;
  }
  /**
   *
   * @returns Повертає масив об'єктів популярних фільмів за день.
   */
  static fetchTrendingMovies() {
    const endPointUrl =
      BASE_URL + this.#endPoints.trending + this.#trending.mediaType + this.#trending.timeWindow;
    const requestParams = {
      api_key: API_KEY,
      page: this.#trending.page + 1,
      language: this.#languages.ENGLISH,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      this.#trending.page = page;
      this.#trending.totalPages = total_pages;
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
  }

  /**
   *
   * @param {string} query
   * Рядок - назва фільму для пошуку.
   * @returns Повертає масив фільмів в назві яких зустрічається query.
   */
  static fetchSearchMovie(query) {
    const endPointUrl = BASE_URL + this.#endPoints.searchMovie;
    const requestParams = {
      api_key: API_KEY,
      page: this.#trending.page + 1,
      language: this.#languages.ENGLISH,
      query,
    };

    return axios.get(endPointUrl, { params: requestParams }).then(({ data }) => {
      const { page, results, total_pages } = data;
      this.#trending.page = page;
      this.#trending.totalPages = total_pages;
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
  }

  /**
   *
   * @param {number} movieId Ідентифікатор фільма в базі данних TMBD
   * @returns Повертає об'єкт з детальним описом всіх характеристик фільму.
   */
  static fetchMovieDetails(movieId) {
    const endPointUrl = BASE_URL + this.#endPoints.movieDetails + movieId;
    const requestParams = {
      api_key: API_KEY,
      language: this.#languages.ENGLISH,
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
  }
}