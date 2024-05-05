// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Función para crear una tabla con la información de la colección "Platos"
async function crearTablaDePlatos(db) {
    const restaurantesSnapshot = await getDocs(collection(db, 'Restaurantes'));
    const tablaPlatos = document.querySelector('.table tbody');
    tablaPlatos.innerHTML = '';

    for (const restauranteDoc of restaurantesSnapshot.docs) {
        let id = 1;
        const platosSnapshot = await getDocs(collection(restauranteDoc.ref, 'Platos'));
        platosSnapshot.forEach((platoDoc) => {
            const plato = platoDoc.data();

            // Crear una nueva fila
            const nuevaFila = document.createElement('tr');

            // Llenar la fila con los datos del plato
            nuevaFila.innerHTML = `
                <td class = "text-dark" scope="row"><strong>${id}</strong></td>
                <td id="nombrePlato">${plato.nombrePlato}</td>
                <td id="precioPlato" style="width: 25% !important;">${plato.precio} €</td>
                <td id="cantidad">${plato.Cantidad}</td>
                <td><button class="btn btn-primary" onclick="irCarta()">Modificar</button></td>
            `;
            id++;
            // Agregar la nueva fila a la tabla
            tablaPlatos.appendChild(nuevaFila);
        });
    }
}

// Llamar a la función para crear la tabla cuando se cargue la página
window.onload = function () {
    crearTablaDePlatos(db);
}