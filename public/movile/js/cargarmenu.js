import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

document.addEventListener('DOMContentLoaded', async () => {
    const platosContainer = document.getElementById('.platosContainer');

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

        console.log('Firebase inicializado');

        const restaurantesSnapshot = await getDocs(collection(db, 'Restaurantes'));
        let htmlContent = ''; // Se utiliza para acumular el HTML de todos los platos

        for (const restauranteDoc of restaurantesSnapshot.docs) {
            const platosSnapshot = await getDocs(collection(restauranteDoc.ref, 'Platos'));
            platosSnapshot.forEach((platoDoc) => {
                const plato = platoDoc.data();
                htmlContent += `
                    <div class="itemComida d-flex justify-content-between pb-1 border-bottom mb-3 cursor-pointer" onclick="visuaComida()" }>
                        <div class="descript d-flex flex-column">
                            <strong>${plato.nombrePlato}</strong>
                            <p><strong>${plato.precio}</strong></p>
                            <div class="short">
                                <p class="ellipsis">${plato.descripcion || ''}</p>
                            </div>
                        </div>
                        <div class="" style="height: 100%;">
                            <img src="${plato.imagenUrl || 'img/paella.png'}" alt="" height="125" width="125">
                        </div>
                    </div>
                `;
            });
        }
        platosContainer.innerHTML = htmlContent; // Se inserta el HTML acumulado en el contenedor de platos una sola vez
    } catch (error) {
        console.error(error);
    }
});
// window.addEventListener('DOMContentLoaded', () => ca);