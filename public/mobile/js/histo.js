import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    limit,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    Timestamp,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const pedidoId = queryParams.get('pId'); // Obtener el ID del pedido de los parámetros de la URL

    const subpedidosContainer = document.getElementById('subpedidosContainer');

    if (!subpedidosContainer) {
        console.error("El contenedor 'subpedidosContainer' no existe en el DOM.");
        return;
    }

    if (!pedidoId) {
        console.error("No se encontró el ID del pedido en los parámetros de la URL.");
        return;
    }

    try {
        const subpedidosSnapshot = await getDocs(collection(db, `Pedidos/${pedidoId}/subPedidos`));
        const subpedidos = [];

        subpedidosSnapshot.forEach((subpedidoDoc) => {
            const subpedido = subpedidoDoc.data();
            subpedido.id = subpedidoDoc.id;
            subpedidos.push(subpedido);
        });

        // Ordena los subpedidos poniendo los de estado 1 primero
        subpedidos.sort((a, b) => {
            if (a.estado === 1 && b.estado !== 1) return -1;
            if (a.estado !== 1 && b.estado === 1) return 1;
            return 0;
        });

        let htmlContent = '';

        subpedidos.forEach((subpedido) => {
            const subpedidoId = subpedido.id;
            const estadoSubpedido = subpedido.estado || 0; // Asumiendo que 'estado' es un campo en tus documentos de subpedido

            // Determinar las clases de borde y color según el estado del subpedido
            let borderClasses = '';
            let estadoTexto = '';
            let suspedidoItem = '';

            switch (estadoSubpedido) {
                case 1:
                    suspedidoItem = 'rainbow';
                    estadoTexto = 'En proceso';
                    break;
                    
                case 2:
                    suspedidoItem = 'suspedidoItem';
                    borderClasses = 'border border-success border-5';
                    estadoTexto = 'Entregado';
                    break;
                    
                default:
                    suspedidoItem = 'suspedidoItem';
                    borderClasses = 'border border-warning border-5';
                    estadoTexto = 'Creando';
                    break;
            }

            // Generar el contenido HTML para cada subpedido
            htmlContent += `
                <div class="${suspedidoItem} ${borderClasses} mb-3 p-3" style="border-radius: 10px;
                    padding: 10px; box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.1);">
                    <p><strong>ID del Subpedido:</strong> ${subpedidoId}</p>
                    <p>Estado: ${estadoTexto}</p>
                </div>
            `;
        });

        subpedidosContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error(`Error al obtener los subpedidos del pedido ${pedidoId}:`, error);
    }
});




// document.addEventListener('DOMContentLoaded', async () => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const pedidoId = queryParams.get('pId'); // Obtener el ID del pedido de los parámetros de la URL

//     const subpedidosContainer = document.getElementById('subpedidosContainer');

//     if (!subpedidosContainer) {
//         console.error("El contenedor 'subpedidosContainer' no existe en el DOM.");
//         return;
//     }

//     if (!pedidoId) {
//         console.error("No se encontró el ID del pedido en los parámetros de la URL.");
//         return;
//     }

//     try {
//         const subpedidosSnapshot = await getDocs(collection(db, `Pedidos/${pedidoId}/subPedidos`));

//         let htmlContent = '';

//         subpedidosSnapshot.forEach((subpedidoDoc) => {
//             const subpedidoId = subpedidoDoc.id;
//             const subpedidoData = subpedidoDoc.data();
//             const estadoSubpedido = subpedidoData.estado || 'Sin estado'; // Asumiendo que 'estado' es un campo en tus documentos de subpedido

//             htmlContent += `
//                 <div class="subpedidoItem border mb-2 p-3" style="border-radius: 10px;
//                 padding: 10px; box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);">

//                 <p><strong>ID del Subpedido:</strong> ${subpedidoId}</p>
                    
//                     <p>Estado: ${estadoSubpedido}</p>
                    
//                 </div>
//             `;
//         });

//         subpedidosContainer.innerHTML = htmlContent;
//     } catch (error) {
//         console.error(`Error al obtener los subpedidos del pedido ${pedidoId}:`, error);
//     }
// });
