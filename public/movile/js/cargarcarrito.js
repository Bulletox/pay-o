import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

document.addEventListener('DOMContentLoaded', async () => {
    const platosContainer = document.getElementById('platosContainer');
    const bebidasContainer = document.getElementById('bebidasContainer'); // Asegúrate de que este elemento existe en tu HTML

    // Obtener parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const instanciaId = queryParams.get('iId');
    const pedidoId = queryParams.get('pId');

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
        let htmlContentcomida = ''; // Se utiliza para acumular el HTML de todos los platos
        let htmlContentbebida = ''; 
        for (const restauranteDoc of restaurantesSnapshot.docs) {
            const platosSnapshot = await getDocs(collection(restauranteDoc.ref, 'Platos'));
            platosSnapshot.forEach((platoDoc) => {
                const plato = platoDoc.data();
                const platoId = platoDoc.id;
                const platoLink = `visuaComida.html?iId=${instanciaId}&pId=${pedidoId}&plId=${platoId}`;

                const itemHtml = `
                <div class="itemComida d-flex justify-content-between pb-1 border-bottom mb-4 cursor-pointer">
                <div class="descript d-flex flex-column">
                    <strong class="fs-3">${plato.nombrePlato}</strong>
                    <p><strong>${plato.precio}€</strong></p>
                    <div class="short">
                        <p class="ellipsis">${plato.descripcion || ''}</p>
                    </div>
                </div>
                <div class="" style="height: 100%;">
                    <img src="${plato.imagenUrl || 'img/paella.png'}" alt="" height="125" width="125">
                </div>
                <div class="d-flex flex-column justify-content-between align-items-center ms-3">
                        <i class="fs-2 bi bi-dash-circle cursor-pointer"></i>
                        <p><strong>1</strong></p>
                        <i class="fs-2 bi bi-plus-circle cursor-pointer"></i>
                    </div>
                </div>
                `;

                if (plato.categoria == 0) {
                    htmlContentcomida += itemHtml;
                } else {
                    htmlContentbebida += itemHtml;
                }
            });
        }
        platosContainer.innerHTML = htmlContentcomida; 
        bebidasContainer.innerHTML = htmlContentbebida; 
    } catch (error) {
        console.error(error);
    }
});

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
// import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

// const firebaseConfig = {
//     apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
//     authDomain: "dam2pay-o.firebaseapp.com",
//     projectId: "dam2pay-o",
//     storageBucket: "dam2pay-o.appspot.com",
//     messagingSenderId: "1010112748895",
//     appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
//     measurementId: "G-H36HTF38QD"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// const db = getFirestore(app);

// async function cargarPlatosPedido(pedidoId, db) {
//     const pedidoRef = doc(db, 'Pedidos', pedidoId);
//     const subPedidosColRef = collection(pedidoRef, 'subPedido');
//     const platosContainer = document.querySelector(`#card-${pedidoId} .platos`);

//     try {
//         const subPedidosSnapshot = await getDocs(subPedidosColRef);

//         for (let subPedidoDoc of subPedidosSnapshot.docs) {
//             const subPedidoData = subPedidoDoc.data();
        
//             console.log("Estado del subpedido:", subPedidoData.estado); // Verificar el valor de estado
        
//             // Filtrar solo los subpedidos con estado distinto de 0
//             if (subPedidoData.estado == 0) {
//                 console.log("Subpedido con estado válido:", subPedidoData.estado);
//                 continue; // Saltar este subpedido si no tiene estado válido
//             }
        
//             const platosPedidoColRef = collection(subPedidoDoc.ref, 'platosPedido');
//             const platosSnapshot = await getDocs(platosPedidoColRef);
        
            
//             for (const platoDoc of platosSnapshot.docs) {
//                 const platoData = platoDoc.data();
//                 const platoRef = platoData.idPlato;

//                 if (typeof platoRef !== 'object' || !platoRef.path) {
//                     console.error('idPlato no es una referencia válida:', platoRef);
//                     continue;
//                 }

//                 const platoSnap = await getDoc(platoRef);
//                 if (!platoSnap.exists()) {
//                     console.error('El documento de plato no existe:', platoRef);
//                     continue;
//                 }

//                 const platoInfo = platoSnap.data();
//                 const idPlatoPath = platoRef.path;

//                 // Crear elemento de interfaz para el plato
//                 const platoElement = document.createElement('div');
//                 platoElement.classList.add('form-check', 'mb-2');
//                 platoElement.innerHTML = `
//                     <input class="form-check-input" type="checkbox" value="" id="plato-${idPlatoPath}">
//                     <label class="form-check-label d-block text-break" for="plato-${idPlatoPath}">
//                         ${platoInfo.nombrePlato} x ${platoData.cantidad}
//                     </label>
//                 `;

//                 platosContainer.appendChild(platoElement);
//             }
//         }
//     } catch (error) {
//         console.error("Error al cargar los platos del pedido: ", error);
//     }
// }