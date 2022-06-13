import { databaseApi } from '..Prokoptsov/databaseApi';

const onWatchedButton = document.querySelector('button[WATCHED]')// refs???
function onWatchedBtn(event) {
    // - отправить запрос get и получить список просмотренных фильмов;
    // - проверить список на наличие фильмов;
    // - отрисовать список фильмов из очереди;
    // - сообщить о том что фильмов в списке нет;
  console.log(event.target);
  const onGetWatchedMovieRender = (watchedMovieArray) => renderMainPage(watchedMovieArray);
  databaseApi.get(DB_ENDPOINTS.WATCHED, store.userId, onGetWatchedMovieRender);
  }

onWatchedButton.addEventListener('click', onWatchedBtn);


//onGetWatchedMovieRender ---> колбек-функція, яка після відповіді від FireBase
// буде рендерети масив доданих фільмів.



// завантажує список додадних фільмів
get: async (path, userId, callback) => {
   /* onValue(ref(db, `users/${userId}/${path}`), async (snapshot) => callback(serialaize.transform(snapshot.val()), userId));
    },
    *
     * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'} 
     * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції 
     * @param {String} movieId // id фільму
     * @returns {Promise} // якщо фільм вже доданий, то поверне Promise зі значенням true, а інакще - false.
     */