import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { app } from "./firebase-sdk";

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
    createUserWithEmailAndPassword: async (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) =>  userCredential.user)
        .catch(console.log);
    },

    // вхід у систему за допомогою пошти та пароля
    /**
     * @param {String} email // email користувача для входу до системи
     * @param {String} password // password користувача для входу до системи
     */
    signInWithEmailAndPassword: async (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => userCredential.user)
            .catch(console.log);
    },

    // функція, яка відстежує чи знаходиться зараз користувач у системі чи ні
    /**
     * @param {Function} callbackIfUserSignedIn // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач залогінений в системі
     * @param {Function} callbackOnIfUserSignedOut // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач в НЕ залогінений в системі
     */
    trackUserLoginState: async (callbackIfUserSignedIn = dummy, callbackOnIfUserSignedOut = dummy) => {

        // функція самого Firebase. Аргумент user потряпляє у фунцкію автоматично. Ми його поки ніяк не обробляємо.
        onAuthStateChanged(auth, (user) => {
            if (user) {
                callbackIfUserSignedIn(user.uid);
              // callback з кастомною логікою.
              // Сюди треба передати ID залогіненого користувача у Firedase,
              // щоб його можно було передати для запиту до бази данних у зовнішньому коді
            } else {
                callbackOnIfUserSignedOut();
              // callback з кастомною логікою
            }
        });
    },
    // функція яка вилогінює користувача з системи.
    // приймає callback з кастомною логікою, якщо щось потрібно зробити, коли користувач вийшов з системи
    /**
     * @param {Function} callbackOnSigningOut // callback з кастомною логікою
     * @returns {Promise} // можна підчипитися then у зовнішньому коді
     */
    signOut: async (callbackOnSigningOut = dummy) => signOut(auth).then(() => callbackOnSigningOut()).catch(console.log),
    
    // реєєстрація/логін користувача до системи за допомогою Google Account
    // колбек опціональний, додав його не перспективу, поки що ніякий колбек, окрім заглушки не передаю
    signInWithGoogle: (callback = dummy) => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        auth.languageCode = 'it';

        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            callback();
        }).catch(console.log);
    }
}