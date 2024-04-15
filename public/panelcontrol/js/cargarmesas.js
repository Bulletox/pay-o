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

async function cargarPedidos() {
    const pedidosContainer = document.querySelector('.row[data-masonry]');
    const pedidosColRef = collection(db, 'Pedidos');
    let cargasPlatosPromesas = []; // Arreglo para almacenar las promesas de cargarPlatosPedido()

    try {
        const querySnapshot = await getDocs(pedidosColRef);
        querySnapshot.forEach((docPedido) => {
            const pedidoId = docPedido.id;
            const tarjetaPedido = document.createElement('div');
            tarjetaPedido.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', 'col-xl-2', 'col-xxl-2', 'mb-4');
            tarjetaPedido.innerHTML = `
                <div class="card" id="card-${pedidoId}">
                    <div class="card-header">
                        <h5 class="card-title pb-0 text-dark mb-0 mt-0">Pedido - ${pedidoId.slice(0, 4)}</h5>
                    </div>
                    <div class="card-body pt-0">
                        <div class="platos">

                        </div>
                        <!-- Aquí irán los detalles del pedido -->
                        <div class="d-flex justify-content-between mt-3">
                            <button type="button" class="btn btn-outline-success">Confirmar</button>
                            <button type="button" class="btn btn-outline-danger" data-card-id="card-${pedidoId}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            pedidosContainer.appendChild(tarjetaPedido);

            // Agregar cada promesa de cargarPlatosPedido al arreglo
            cargasPlatosPromesas.push(cargarPlatosPedido(pedidoId, db));
        });

        // Espera a que todas las cargas de platos se completen
        await Promise.all(cargasPlatosPromesas);

        // Ahora que todos los datos están cargados, inicializa Masonry
        var masonryGrid = document.querySelector('.row[data-masonry]');
        if (masonryGrid) {
            new Masonry(masonryGrid, {
                itemSelector: '.col-sm-6.col-md-6.col-lg-4.col-xl-2.col-xxl-2',
                percentPosition: true
            });
        }
    } catch (error) {
        console.error("Error al cargar los pedidos: ", error);
    }
}


async function cargarPlatosPedido(pedidoId, db) {
    const pedidoRef = doc(db, 'Pedidos', pedidoId);
    const subPedidosColRef = collection(pedidoRef, 'subPedido');
    const platosContainer = document.querySelector(`#card-${pedidoId} .platos`);
    let platosAgrupados = {};
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
                const idPlatoPath = platoRef.path;

                if (platoData.comentarios) {
                    // Para platos con comentarios, manejarlos individualmente
                    platosIndividuales.push({
                        ...platoData,
                        nombrePlato: platoInfo.nombrePlato,
                        idPlatoPath
                    });
                } else {
                    // Agrupar platos sin comentarios
                    if (!platosAgrupados[idPlatoPath]) {
                        platosAgrupados[idPlatoPath] = {
                            cantidad: 0,
                            nombrePlato: platoInfo.nombrePlato
                        };
                    }
                    platosAgrupados[idPlatoPath].cantidad += platoData.cantidad;
                }
            }
        }

        // Crear elementos de interfaz para platos agrupados
        for (const [idPlatoPath, platoAgrupado] of Object.entries(platosAgrupados)) {
            const platoElement = document.createElement('div');
            platoElement.classList.add('form-check', 'mb-2');
            platoElement.innerHTML = `
            <input class="form-check-input" type="checkbox" value="" id="plato-${idPlatoPath}">
            <label class="form-check-label d-block text-break" for="plato-${idPlatoPath}">
              ${platoAgrupado.nombrePlato} x${platoAgrupado.cantidad}
            </label>
        `;
            platosContainer.appendChild(platoElement);
        }

        // Crear elementos de interfaz para platos individuales
        platosIndividuales.forEach(plato => {
            const platoElement = document.createElement('div');
            platoElement.classList.add('form-check', 'mb-2');
            platoElement.innerHTML = `
        <input class="form-check-input" type="checkbox" value="" id="plato-">
            <label class="form-check-label d-block text-break" for="plato-">
                ${plato.nombrePlato} x 1
            </label>
                 <div class="p-1 bg-warning-subtle border border-warning rounded-3 d-inline-block">
                 ${plato.comentarios}
                </div>
        `;
            platosContainer.appendChild(platoElement);
        });

    } catch (error) {
        console.error("Error al cargar los platos del pedido: ", error);
    }
}

// No olvides pasar la instancia de tu base de datos (`db`) cuando llames a esta función.

// // Llamar a la función cuando el DOM esté listo
// window.addEventListener('DOMContentLoaded', () => cargarPedidos());
window.addEventListener('DOMContentLoaded', () => {
    cargarPedidos().then(() => {
        // Este código se ejecuta después de que cargarPedidos() y todas sus operaciones internas han terminado.
        // Es aquí donde deberías inicializar Masonry, para asegurarte de que se haga después de cargar todos los datos.
        const masonryGrid = document.querySelector('.row[data-masonry]');
        if (masonryGrid) {
            new Masonry(masonryGrid, {
                itemSelector: '.col-sm-6.col-md-6.col-lg-4.col-xl-2.col-xxl-2',
                percentPosition: true
            });
        }
    }).catch(error => console.error("Error durante la inicialización de los pedidos o Masonry: ", error));
});