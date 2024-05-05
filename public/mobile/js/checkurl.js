import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la referencia de Firestore
const db = getFirestore(app);

// Función para verificar la existencia de los documentos
async function verifyDocuments() {
    // Obtén los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const instanciaId = urlParams.get('iId');
    const pedidoId = urlParams.get('pId');

    // Comprueba la existencia de los documentos en las colecciones correspondientes
    const instanciaDocRef = doc(db, "Instanciamesas", instanciaId);
    const pedidoDocRef = doc(db, "Pedidos", pedidoId);

    try {
        const instanciaDoc = await getDoc(instanciaDocRef);
        const pedidoDoc = await getDoc(pedidoDocRef);

        // Si ambos documentos existen, no hagas nada (o realiza alguna acción específica)
        if (instanciaDoc.exists() && pedidoDoc.exists()) {
            console.log("Ambos documentos existen.");
        } else {
            // Si alguno de los documentos no existe, redirige a la página 404
            window.location.href = './404.html';
        }
    } catch (error) {
        console.error("Error al acceder a los documentos: ", error);
        // Redirige a la página 404 en caso de error
        window.location.href = './404.html';
    }
}

// Llama a la función para verificar los documentos
verifyDocuments();
