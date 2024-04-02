// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
  authDomain: "dam2pay-o.firebaseapp.com",
  projectId: "dam2pay-o",
  storageBucket: "dam2pay-o.appspot.com",
  messagingSenderId: "1010112748895",
  appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
  measurementId: "G-H36HTF38QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para iniciar sesión de forma anónima
export async function iniciarSesionAnonima() {
    try {
        const result = await signInAnonymously(auth);
        console.log('Usuario anónimo conectado', result.user);
        return result.user;
    } catch (error) {
        console.error('Error en inicio de sesión anónimo', error);
        throw error;
    }
}