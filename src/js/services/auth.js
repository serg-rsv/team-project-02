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
    createUserWithEmailAndPassword: async (email, password, callback) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            callback(user.uid);
        })
        .catch((error) => {
            console.log(error);
        });
    },

    // вхід у систему за допомогою пошти та пароля
    /**
     * @param {String} email // email користувача для входу до системи
     * @param {String} password // password користувача для входу до системи
     */
    signInWithEmailAndPassword: async (email, password, callback) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                callback(user.uid);
            })
            .catch(console.log);
    },

    // функція, яка відстежує чи знаходиться зараз користувач у системі чи ні
    /**
     * @param {Function} callbackIfUserSignedIn // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач залогінений в системі
     * @param {Function} callbackOnIfUserSignedOut // приймає кастомний callback, який містить логіку того, що треба зробити, коли користувач в НЕ залогінений в системі
     */
    trackUserLoginState: async (callbackIfUserSignedIn = dummy, callbackOnIfUserSignedOut = dummy) => {

        // функція самого Firebase. Аргумент user потряпляє у фунцкію автоматично. Ми його поки ніяк не обробляємо.
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

              // callback з кастомною логікою.
              // Сюди треба передати ID залогіненого користувача у Firedase,
              // щоб його можно було передати для запиту до бази данних у зовнішньому коді
                callbackIfUserSignedIn(uid);
            } else {
              // callback з кастомною логікою
                callbackOnIfUserSignedOut();
                console.log('out');
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
        return signOut(auth).then(() => callbackOnSigningOut()).catch(console.log);
    }
}