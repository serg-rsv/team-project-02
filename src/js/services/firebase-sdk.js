// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAutR8LQAryGBD4KQz3S34HFCIHoEhmpOI',
//   authDomain: 'filmoteka-7196f.firebaseapp.com',
//   projectId: 'filmoteka-7196f',
//   storageBucket: 'filmoteka-7196f.appspot.com',
//   messagingSenderId: '345761584449',
//   appId: '1:345761584449:web:4d0491a5aa57059d43fdc0',
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);


// ================== Prokoptsov. Моя база даних. Залищу тут, щоб не копіювати зайвий раз ================//
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDwSvxW_JXUXvoWY1_A9PdYIPJMFKQzzDI",
  authDomain: "register-auth-test.firebaseapp.com",
  databaseURL: "https://register-auth-test-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "register-auth-test",
  storageBucket: "register-auth-test.appspot.com",
  messagingSenderId: "168929157221",
  appId: "1:168929157221:web:a174132e7602c8904d668c",
  measurementId: "G-ZCRJSGC9ER"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//==============================================================================//