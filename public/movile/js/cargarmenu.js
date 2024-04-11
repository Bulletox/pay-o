import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

document.addEventListener('DOMContentLoaded', async () => {
    const platosContainer = document.getElementById('platosContainer');

    try {
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
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        // Inicializar Firebase
        //firebase.initializeApp(firebaseConfig);
        
        // Obtener todos los restaurantes
        const restaurantesSnapshot = await getDocs(collection(db, 'Restaurantes'));

        restaurantesSnapshot.forEach(async (restauranteDoc) => {
            const platosSnapshot = await getDocs(collection(restauranteDoc.ref, 'Platos'));

            platosSnapshot.forEach((platoDoc) => {
                const plato = platoDoc.data();

                const itemComida = document.createElement('div');
                itemComida.classList.add('itemComida', 'd-flex', 'justify-content-between', 'pb-1', 'border-bottom', 'mb-3', 'cursor-pointer');

                const descript = document.createElement('div');
                descript.classList.add('descript', 'd-flex', 'flex-column');

                const nombrePlato = document.createElement('strong');
                nombrePlato.textContent = plato.nombrePlato;
                descript.appendChild(nombrePlato);

                const precioPlato = document.createElement('p');
                precioPlato.innerHTML = `<strong>${plato.precio} €</strong>`;
                descript.appendChild(precioPlato);

                const descripcionPlato = document.createElement('div');
                descripcionPlato.classList.add('short');
                descripcionPlato.innerHTML = `<p class="ellipsis">${plato.descripcion || ''}</p>`;
                descript.appendChild(descripcionPlato);

                itemComida.appendChild(descript);

                const imagenPlato = document.createElement('img');
                imagenPlato.src = plato.imagenUrl;
                imagenPlato.alt = plato.nombrePlato;
                imagenPlato.height = 125;
                imagenPlato.width = 125;
                itemComida.appendChild(imagenPlato);

                platosContainer.appendChild(itemComida);
            });
        });
    } catch (error) {
        console.error(error);
    }
});