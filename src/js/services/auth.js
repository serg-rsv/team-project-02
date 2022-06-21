import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { app } from './firebase-sdk';

// прив'язка до проекту у Firebase Authentication
const auth = getAuth(app);

// функція-заглушка
const dummy = () => {};

export const authApi = {
  // реєстрація нового користувача за поштою та паролем
  /**
   * @param {String} email // email користувача для реєстрації
   * @param {String} password // password користувача для реєстрації
   */
  createUserWithEmailAndPassword: async (email, password, callbackOnSucces, callbackOnError) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        callbackOnSucces(user);
      })
      .catch(error => callbackOnError(error));
  },

  // вхід у систему за допомогою пошти та пароля
  /**
   * @param {String} email // email користувача для входу до системи
   * @param {String} password // password користувача для входу до системи
   */
  signInWithEmailAndPassword: async (email, password, callbackOnSuccess, callbackOnError) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        callbackOnSuccess(user);
      })
      .catch(error => callbackOnError(error));
  },

  // функція, яка відстежує чи знаходиться зараз користувач у системі чи ні
  /**
   * @param {Function} callbackIfUserSignedIn // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач залогінений в системі
   * @param {Function} callbackOnIfUserSignedOut // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач в НЕ залогінений в системі
   */
  trackUserLoginState: async (
    callbackIfUserSignedIn = dummy,
    callbackOnIfUserSignedOut = dummy,
  ) => {
    // функція самого Firebase. Аргумент user потряпляє у фунцкію автоматично. Ми його поки ніяк не обробляємо.
    return onAuthStateChanged(auth, user => {
      if (user) {
        const uid = user.uid;

        // callback з кастомною логікою.
        // Сюди треба передати ID залогіненого користувача у Firedase,
        // щоб його можно було передати для запиту до бази данних у зовнішньому коді
        callbackIfUserSignedIn(user);
      } else {
        // callback з кастомною логікою
        callbackOnIfUserSignedOut();
        // console.log('out');
      }
    });
  },
  // функція яка вилогінює користувача з системи.
  // приймає callback з кастомною логікою, якщо щось потрібно зробити, коли користувач вийшов з системи
  /**
   * @param {Function} callbackOnSigningOut // callback з кастомною логікою
   * @returns {Promise} // можна підчипитися then у зовнішньому коді
   */
  signOut: async (callbackOnSigningOut = dummy) => {
    return signOut(auth)
      .then(() => callbackOnSigningOut())
      .catch(console.log);
  },
  signInWithGoogle: (callbackOnSucces, callbackOnError) => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth.languageCode = 'it';

    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        callbackOnSucces(user);
        // ...
      })
      .catch(error => callbackOnError(error));
  },
};
