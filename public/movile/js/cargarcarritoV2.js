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
    const platosContainer = document.getElementById('platosContainer');

    if (!platosContainer) {
        console.error("El elemento 'platosContainer' no existe en el DOM.");
        return;
    }

    // Obtiene los parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const pedidoId = queryParams.get('pId');

    // Obtén el ID del último subpedido con estado 0
    const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);

    if (!subPedidoId) {
        console.error('No se pudo obtener el último subpedido con estado 0.');
        console.error('Creando un nuevo subpedido...');
        crearSubPedido(pedidoId, db); // Crear un nuevo subpedido
        return;
    }

    // Suscribe a los cambios de la colección de platos del subpedido
    const unsub = onSnapshot(collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`), (snapshot) => {
        const conteoPlatos = {}; // Reiniciar el contador de platos cada vez
        const confirmarBtn = document.getElementById('confirmarPedidoBtn');
        confirmarBtn.addEventListener('click', () => {
            confirmarPedido(pedidoId, db, unsub);
        });
        snapshot.docs.forEach((doc) => {
            const platoData = doc.data();
            const platoRef = platoData.idPlato; // Esta es la referencia del documento

            if (platoRef) {
                getDoc(platoRef).then(platoDocSnapshot => {
                    if (platoDocSnapshot.exists()) {
                        const plato = platoDocSnapshot.data();
                        const nombrePlato = plato.nombrePlato; // Asume que el campo se llama 'nombrePlato'

                        // Actualizar el conteo acumulativo de platos
                        conteoPlatos[nombrePlato] = (conteoPlatos[nombrePlato] || 0) + 1;

                        // Actualizar la UI
                        updateUI(conteoPlatos);
                    } else {
                        console.error(`No se encontró el plato con la referencia: ${platoRef.path}`);
                    }
                });
            }
        });
    }, (error) => {
        console.error("Error al escuchar los cambios: ", error);
    });

    // Esta función puede ser llamada para actualizar la UI cada vez que hay un cambio
    function updateUI(conteoPlatos) {
        let htmlContent = '';
        const confirmarBtn = document.getElementById('confirmarPedidoBtn'); // Accede al botón Confirmar
    
        // Verifica si el objeto conteoPlatos está vacío
        if (Object.keys(conteoPlatos).length === 1) {
            htmlContent = '<p>Empieza tu pedido.</p>'; // Mensaje cuando no hay platos
            confirmarBtn.disabled = true; // Deshabilita el botón Confirmar
        } else {
            // Itera sobre los platos contados y crea el HTML
            Object.entries(conteoPlatos).forEach(([nombrePlato, cantidad]) => {
                htmlContent += `
                    <div class="platoItem">
                        <strong>Plato: ${nombrePlato}</strong>
                        <p>Cantidad total: ${cantidad}</p>
                        <p>Tu Cantidad: ${cantidad}</p>
                    </div>
                `;
            });
            confirmarBtn.disabled = false; // Habilita el botón Confirmar
        }
    
        // Actualiza el contenido de platosContainer con el nuevo HTML
        platosContainer.innerHTML = htmlContent;
    }

});

async function buscarUltimoSubpedidoConEstadoCero(pedidoId, db) {
    const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
    const q = query(subpedidosRef, where('estado', '==', 0), orderBy('timestampCreacion', 'desc'), limit(1));
    try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const ultimoSubpedido = snapshot.docs[0];
            return ultimoSubpedido.id;
        } else {
            console.log("No se encontraron subpedidos con estado '0'.");
            return null;
        }
    } catch (error) {
        console.error("Error al buscar el último subpedido con estado '0':", error);
        return null;
    }
}

// Asegúrate de tener un botón o algún disparador que llame a esta función
async function confirmarPedido(pedidoId, db, unsub) {
    const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);
    if (!subPedidoId) {
        alert('No hay subpedido para confirmar.');
        return;
    }

    const subPedidoRef = doc(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}`);

    try {
        await updateDoc(subPedidoRef, {
            estado: parseInt(1), // Cambiar el estado del subpedido a "1" (confirmado)
        });

        alert('Pedido confirmado correctamente');
        unsub();// Detener la escucha de cambios en la colección de platosPedido
        crearSubPedido(pedidoId, db); // Crear un nuevo subpedido 
        window.history.back();

    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
    }
}

function crearSubPedido(idPedido, db) {
    let estadoSubPedido = 0; // Estado inicial para el subPedido
    let timestampCreacionSubPedido = Timestamp.fromDate(new Date()); // Fecha y hora actual

    // Creamos el subPedido
    const subPedidosRef = collection(db, `/Pedidos/${idPedido}/subPedidos`);
    addDoc(subPedidosRef, {
        estado: estadoSubPedido,
        timestampCreacion: timestampCreacionSubPedido
    }).then((docRefSubPedido) => {
        console.log("SubPedido creado con ID: ", docRefSubPedido.id);

        // Creamos un documento de marcador de posición en la subcolección "platosPedido"
        const platosPedidoRef = collection(db, `/Pedidos/${idPedido}/subPedidos/${docRefSubPedido.id}/platosPedido`);
        return addDoc(platosPedidoRef, {});
    }).then((docRefPlato) => {
        console.log("Documento de marcador de posición en platosPedido creado con ID: ", docRefPlato.id);
    }).catch((error) => {
        console.error("Error creando el subPedido o el documento de marcador de posición: ", error);
    });
}

