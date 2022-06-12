import { authApi } from "../services/auth";
import { databaseApi } from "../services/db";
import { serialaize } from "../services/serialize";

const test = [
  {
    "id": 705861,
    "genre_ids": [18, 35],
    "title": "Hustle",
    "vote_average": 7.4,
    "releaseYear": "2022",
    "posterUrl": "https://image.tmdb.org/t/p/w500/fVf4YHHkRfo1uuljpWBViEGmaUQ.jpg"
  },
  {
    "id": 648579,
    "genre_ids": [28, 35, 80],
    "title": "The Unbearable Weight of Massive Talent",
    "vote_average": 7.4,
    "releaseYear": "2022",
    "posterUrl": "https://image.tmdb.org/t/p/w500/bmxCAO0tz79xn40swJAEIJPRnC1.jpg"
  },
  {
    "id": 507086,
    "genre_ids": [878, 28, 12, 53],
    "title": "Jurassic World Dominion",
    "vote_average": 6.8,
    "releaseYear": "2022",
    "posterUrl": "https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg"
  },
];

// перелік єкшенів в submit інпутах форми, щоб зе робити помилку
const ACTION_TYPE = {
    LOGGIN: 'signIn',
    REGISTER: 'register',
};
// перелік єндпоінтів у Firabase у які требі зберігати/читати дані з фільмами. Об'єкт також створений з метою уникнення опечатки
const DB_ENDPOINTS = {
    WATCHED: 'watched',
    QUEUE: 'queue',
};
// змінна щоб зберегти дані після спрацювання колбека при завантаженні фільмів з Firebase DB
let DATA_FROM_DATABASE = null;

// ТЕСТОВИЙ обє'кт з посиланнями на DOM-елементи. 
const refs = {
    modal: document.querySelector('[data-js="auth-form-modal"]'),
    authForm: document.querySelector('[data-js="auth-form"]'),
    singOutBtn: document.querySelector('[data-js="sign-out"]'),
    myLibraryBtn: document.querySelector('[data-js="open-modal"]'),
    authRoot: document.querySelector('#auth-root'),
    showDataBtn: document.querySelector('#show'),
};

// ТЕСТОВИЙ слухач, щоб перевірити чи працює
// збереження даних після відпрацювання коблбеку при стягуванні фільмів в Firebase DB
refs.showDataBtn.addEventListener('click', e => {
    // перевірка видалення. Працює
  // databaseApi.delete(DB_ENDPOINTS.QUEUE, DATA_FROM_DATABASE.userId, DATA_FROM_DATABASE.movieList[0].dbId);
  console.log(DATA_FROM_DATABASE);
})

// слухачі подій
refs.authForm.addEventListener('click', onAuthFormClick);
refs.singOutBtn.addEventListener('click', onSignOutBtnClick);
refs.myLibraryBtn.addEventListener('click', () => {

    // при натиску на кнопку MyLibrary відстежуємо стан користувача у системі.
    // Але думаю, що требе trackUserLoginState буду винести з функції. Треба ще доробляти і тестувати
    authApi.trackUserLoginState(userIsSignedIn, userIsSignedOut);
})

// оброблюємо submit форми. Не дивіться, що подія 'click', а не 'submit'
// у формі дві кнопки submit і оброботи іх на подїї 'submit' неможливо. Лише через 'click'
function onAuthFormClick(e) {
    e.preventDefault();

    const action = e.target.name;
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    switch (action) {
        case ACTION_TYPE.LOGGIN:
        authApi.signInWithEmailAndPassword(email, password);
        break;
        case ACTION_TYPE.REGISTER:
        authApi.createUserWithEmailAndPassword(email, password);
        break;
        default: return;
    };

    e.currentTarget.reset();
}

// обробляємо кліл на кнопку вилогінювання з системи
function onSignOutBtnClick () {
    authApi.signOut();
    refs.modal.classList.remove('open');
}

// callback для обробки стану, коли користувач знаходиться у системі
async function userIsSignedIn (userId) {
    refs.modal.classList.remove('open');
    createLibraryMarkup();

    // =============== ПОТРІБНЕ РОЗКОМЕНТУВАТИ ТА ЮЗАТИ ================//

    // ==== завантаження усіх доданих фільмів з бази даних.
    // ==== важливо передати звідки завантажити (endpoint), ID юзера
    // ==== та колбек, який передасть масив об'єктів у зовнішній код.
    // ==== Бо функція databaseApi.get не повертає нічого. Так зробив Google
    // const a = await databaseApi.get(DB_ENDPOINTS.QUEUE, userId, onGettingMovieFromDB);
    // databaseApi.get(DB_ENDPOINTS.QUEUE, userId, onFetchMovieSaveData);

    // ==== перевыряємо чи був вже філь доданий до бази данних.
    // ==== по чому перевіряти - ID фільма у базі даних чи порівняння двох об'єктів - питання поки що відкрите
    // ==== наразі перевіряю через порівняня двох JSON об'єктів
    // const isMovieInDataBase = await databaseApi.check(DB_ENDPOINTS.QUEUE, userId, test[1]);
    // isMovieInDataBase
    //                   ? alert('Is already in database')
    //                   : databaseApi.add(DB_ENDPOINTS.QUEUE, userId, test[1])
    //                               .then(() => console.log('successful'))
    //                               .catch(() => console.log('error'));
    
    // ==== видалеємо фільм із бази даних по ID фільму у базі даних Firebase.
    // await databaseApi.delete(DB_ENDPOINTS.QUEUE, userId, a[0].dbId);
}
// callback для обробки стану, коли користувач НЕ знаходиться у системі
function userIsSignedOut () {
    refs.modal.classList.add('open');
    destroy();
}
// функція-болванка для тестування роботи входу/виходу з системи
function createLibraryMarkup () {
  const markup = `
      <div>
        Вы вошли в свой аккаунт
      </div>
  `;
  refs.authRoot.insertAdjacentHTML('beforeend', markup);
}
// функція-болванка для тестування роботи входу/виходу з системи
function destroy () {
    refs.authRoot.innerHTML = '';
}

// callback який зберігає завантаженні з бази даних Firebase фільми у зовнішній код
function onFetchMovieSaveData (movieList, userId) {
    DATA_FROM_DATABASE = {
        userId,
        movieList
    }
}
