import { Notify } from 'notiflix';
import { renderMainPage } from '../kaplunenko/render';
import { tmdbApi } from '../services/tmdb-api';
// переніс таки в індекс =)
/**
 *
 * @param {string} query  - Необов'язковий параметр, потрібен, якщо дані, які требя відмальовувати формуються
 * за строковим запитом query до API. query - це і є наш строковий запит
 * @returns {Promise} - повертає проміс, в якому зберігаються дані з API за нашим запитом
 */

async function infinityScrollData(query) {
  try {
    let movies;
    if (!query) {
      movies = await tmdbApi.fetchTrendingMovies();
    }
    if (query) {
      movies = await tmdbApi.fetchSearchMovie(query);
    }
    renderMainPage(movies);
    if (movies.length < 20 || tmdbApi.trendingPage > tmdbApi.trendingTotalPage) return;
    const triggeredLoadMoreElement = document.querySelector(
      '.products__cards-item:nth-last-child(4) img',
    );
    triggeredLoadMoreElement.addEventListener('load', onLoad);
    function onLoad() {
      triggeredLoadMoreElement.removeEventListener('load', onLoad);
      loadMore(infinityScrollData, query);
    }
    return new Promise(resolve => resolve(movies));
  } catch (error) {
    Notify.failure(error.message);
  }
}

/**
 *
 * @param {function} callback - Функція, яка буде викликана після того, як третій параметр (селектор) з'явиться на екрані.
 * @param {string} query - запит. Необов'язковий параметр, потрібен в якості атрибуту функциї callback.
 * @param {string} selector - Селектор елементу, після якого буде додано нові дані. Обсервер чекає, доки цей елемент з'явиться на сторінці. По замовчанню '.products__cards-item:last-child'.
 */
function loadMore(callback, query, selector = '.products__cards-item:last-child') {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          console.log('load more ', query);
          callback(query);
        }
      });
    },
    {
      threshold: 0.5, // Процентне відношення елемента до відображення на екрані.
    },
  );

  observer.observe(document.querySelector(selector));
}

export { infinityScrollData, loadMore };
