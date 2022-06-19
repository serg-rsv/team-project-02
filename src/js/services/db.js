import {
  getDatabase,
  set,
  ref,
  push,
  onValue,
  get,
  child,
  remove,
  query,
  limitToLast,
} from 'firebase/database';
import { app } from './firebase-sdk';
import { serialaize } from './serialize';

// створення посилання на базу даних додатку/сайту
const db = getDatabase(app);

export const databaseApi = {
  /**
   * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'}
   * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції
   * @param {Object} movie // звичайний js об'єкт, який треба додати до бази данних
   * @returns {Promise} // у зовнішньому коді можна виконати якусь логіку, наприклад вивести повідомлення, що фильм був доданий до бази данних
   */
  // додає фільм до бази даних
  add: async (path, userId, movie) =>
    set(ref(db, `users/${userId}/${path}/${movie.id}`), serialaize.stringify(movie)),
  /**
   * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'}
   * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції
   * @param {Function} callback // Функція onValue нічого не повертає, тому треба передати колбек, який передасть у зовнішній код список фільмів. Можна зробити then тут у database-api, але на мій погляд це краще робити у зовнішньому коді через колбек.
   * @returns
   */
  // завантажує список додадних фільмів
  get: async (path, userId, callback) => {
    onValue(ref(db, `users/${userId}/${path}`), async snapshot =>
      callback(serialaize.transform(snapshot.val())),
    );
  },
  /**
   * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції
   * @param {String} movieId // id фільму
   * @returns {Promise} // якщо фільм вже доданий, то поверне Promise зі значенням true, а інакще - false.
   */
  // перевіряє, чи був вже доданий фільм до бази даних
  check: (userId, movieId) =>
    get(child(ref(db), `users/${userId}/`)).then(snapshot => {
      const movieIdToString = movieId.toString();
      return {
        isInWatched: snapshot.child('watched').hasChild(movieIdToString),
        isInQueue: snapshot.child('queue').hasChild(movieIdToString),
      };
    }),
  /**
   * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'}
   * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції
   * @param {String} movieDbId // ID фільму у базі данних Firebase.
   * @returns {Promise} // повертає Promise, тому у зовнішньому коді можна зробити then, та повідомити коричтувача, що фільм був видалений.
   */
  // видаляє фільм по ID
  delete: async (path, userId, movieDbId) =>
    remove(child(ref(db, `users/${userId}/${path}`), String(movieDbId))),
};
