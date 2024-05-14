// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZxwjtQ5Ps9Bzd1_EWz8qjfzMRylYEQcE",
  authDomain: "futsimsp.firebaseapp.com",
  projectId: "futsimsp",
  storageBucket: "futsimsp.appspot.com",
  messagingSenderId: "509800851287",
  appId: "1:509800851287:web:4759024276ceab1487c012",
  measurementId: "G-T1K42HPB18"
};



// Inicializa la aplicación Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Obtiene el objeto 'auth' de Firebase
const auth = getAuth(app);

export { auth }; // Exporta el objeto 'auth' para que otros archivos puedan importarlo