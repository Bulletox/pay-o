import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

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
// const analytics = getAnalytics(app);
const db = getFirestore(app);

async function cargarPlatosPedido( db) {
    const pedidoRef = doc(db, 'Pedidos', pedidoId);
    const subPedidosColRef = collection(pedidoRef, 'subPedido');
    const platosContainer = document.getElementById('platosContainer');
    let platosIndividuales = [];

    try {
        const subPedidosSnapshot = await getDocs(subPedidosColRef);
        for (let subPedidoDoc of subPedidosSnapshot.docs) {
            const platosPedidoColRef = collection(subPedidoDoc.ref, 'platosPedido');
            const platosSnapshot = await getDocs(platosPedidoColRef);
            for (const platoDoc of platosSnapshot.docs) {
                const platoData = platoDoc.data();
                const platoRef = platoData.idPlato;

                if (typeof platoRef !== 'object' || !platoRef.path) {
                    console.error('idPlato no es una referencia válida:', platoRef);
                    continue;
                }

                const platoSnap = await getDoc(platoRef);
                if (!platoSnap.exists()) {
                    console.error('El documento de plato no existe:', platoRef);
                    continue;
                }

                const platoInfo = platoSnap.data();
                platosIndividuales.push({
                    ...platoData,
                    nombrePlato: platoInfo.nombrePlato,
                    precio: platoInfo.precio,
                    descripcion: platoInfo.descripcion,
                    imagenUrl: platoInfo.imagenUrl
                });
            }
        }

        // Crear elementos de interfaz para platos individuales con la nueva plantilla
        platosIndividuales.forEach(plato => {
            const htmlContent = `
                <div class="itemComida d-flex justify-content-between pb-1 border-bottom mb-3 cursor-pointer" onclick="visuaComida(${plato.idPlato})">
                    <div class="descript d-flex flex-column">
                        <strong class="fs-3">${plato.nombrePlato}</strong>
                        <p><strong>${plato.precio}€</strong></p>
                        <p class="ellipsis">${plato.descripcion || ''}</p>
                    </div>
                    <div class="cursor-pointer" style="height: 100%;">
                        <img src="${plato.imagenUrl || 'img/paella.png'}" alt="" height="125" width="125">
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-center ms-3">
                        <i class="fs-4 bi bi-dash-circle cursor-pointer"></i>
                        <p><strong>1</strong></p>
                        <i class="fs-4 bi bi-plus-circle cursor-pointer"></i>
                    </div>
                </div>
            `;
            const platoElement = document.createElement('div');
            platoElement.innerHTML = htmlContent;
            platosContainer.appendChild(platoElement);
        });

    } catch (error) {
        console.error("Error al cargar los platos del pedido: ", error);
    }
}
window.addEventListener('DOMContentLoaded', () =>cargarPlatosPedido('1', db));
