// Importaciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
    authDomain: "dam2pay-o.firebaseapp.com",
    projectId: "dam2pay-o",
    storageBucket: "dam2pay-o.appspot.com",
    messagingSenderId: "1010112748895",
    appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
    measurementId: "G-H36HTF38QD"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const idInstancia = queryParams.get('iId');

    if (idInstancia) {
        console.log("ID de la Instancia:", idInstancia);
        iniciarSesionAnonima(idInstancia);
    } else {
        console.log("No se encontró ID de instancia en la URL.");
    }
});

function iniciarSesionAnonima(idInstancia) {
    signInAnonymously(auth)
        .then((result) => {
            console.log('Usuario anónimo conectado', result.user.uid);
            // Refactorización para usar los nuevos métodos modulares de Firestore
            const instanciaMesaRef = doc(db, "/Instanciamesas", idInstancia);
            updateDoc(instanciaMesaRef, {
                usuarios: arrayUnion(result.user.uid)
                
            });
            console.log('Usuario añadido a la instancia de mesa');
        })
        .catch((error) => {
            console.error('Error en inicio de sesión anónimo', error);
        });
}
