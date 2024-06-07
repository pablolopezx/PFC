// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Importa getStorage para el servicio de almacenamiento
import { getFirestore } from "firebase/firestore"; // Importa la función getFirestore para Firestore
import 'firebase/auth';
import 'firebase/firestore';
// importa otros servicios según sea necesario

// Tu configuración de Firebase
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
const auth = getAuth(app);
const firestore = getFirestore(app); //Inicializa Firestore
const storage = getStorage(app); // Inicializa el servicio de almacenamiento

export { auth, analytics, firestore, storage }; // Exporta auth, analytics,firestore y storage para que otros archivos puedan importarlos
