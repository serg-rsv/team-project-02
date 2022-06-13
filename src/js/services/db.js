import { getDatabase, set, ref, push, onValue, get, child, remove } from 'firebase/database';
import { app } from './firebase-sdk';
import { serialaize } from './serialize';

/ створення посилання на базу даних додатку/сайту
const db = getDatabase(app);

export const databaseApi = {
    /**
     * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'} 
     * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції 
     * @param {Object} movie // звичайний js об'єкт, який треба додати до бази данних
     * @returns {Promise} // у зовнішньому коді можна виконати якусь логіку, наприклад вивести повідомлення, що фильм був доданий до бази данних
     */
    // додає фільм до бази даних
    add: async (path, userId, movie) => {
        const serializedMovie = serialaize.stringify(movie);

        return set(push(ref(db, 'users/' + userId + `/${path}`)), serializedMovie);
    },
    /**
     * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'} 
     * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції 
     * @param {Function} callback // Функція onValue нічого не повертає, тому треба передати колбек, який передасть у зовнішній код список фільмів. Можна зробити then тут у database-api, але на мій погляд це краще робити у зовнішньому коді через колбек.
     * @returns 
     */
    // завантажує список додадних фільмів
    get: async (path, userId, callback) => {
            const pathRef = ref(db, 'users/' + userId + `/${path}`);
            onValue(pathRef, async (snapshot) => {
                const data = snapshot.val();

                callback(serialaize.transform(data), userId);
            });
    },
    /**
     * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'} 
     * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції 
     * @param {Object} movie // звичайний js об'єкт, який треба додати до бази данних
     * @returns {Promise} // якщо фільм вже доданий, то поверне Promise зі значенням true, а інакще - false.
     */
    // перевіряє, чи був вже доданий фільм до бази даних
    check: async (path, userId, movie) => {
        const serialaizedData = serialaize.stringify(movie);
        const dbRef = ref(db);
        
        return get(child(dbRef, `users/${userId}/${path}`)).then(snapshot => {
            const exist = Object.values(snapshot.val() || {}).some(value => value === serialaizedData);
            
            return exist;
        })
    },
    /**
     * @param {String} path // Endpoint у базі данних. Їх буде лише два - 'watched' або 'queue'. Для зручності та запобіганню помилки при написанні виніс ці endpoint  до об'єкта const DB_ENDPOINTS = {  WATCHED: 'watched', QUEUE: 'queue'} 
     * @param {Object} userId // ID користувача приходить у колбек після успішної авторизації. Все що треба, це передати цей айді до функції 
     * @param {String} movieDbId // ID фільму у базі данних Firebase.
     * @returns {Promise} // повертає Promise, тому у зовнішньому коді можна зробити then, та повідомити коричтувача, що фільм був видалений.
     */
    // видаляє фільм по ID
    delete: async (path, userId, movieDbId) => {
        const dbRef = ref(db, 'users/' + userId + `/${path}`);
        return remove(child(dbRef, movieDbId));
    }
}