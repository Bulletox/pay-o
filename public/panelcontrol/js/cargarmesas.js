// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, writeBatch, } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

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
    pedidosContainer.innerHTML = ''; // Limpia el contenedor antes de cargar nuevos pedidos
    const pedidosColRef = collection(db, 'Pedidos');

    try {
        const querySnapshot = await getDocs(pedidosColRef);
        for (let docPedido of querySnapshot.docs) {
            const pedidoId = docPedido.id;
            const pedidoData = docPedido.data();

            let diferenciaEnMinutos = Infinity; // Valor por defecto para pedidos sin timestamp
            let claseColorHeader = 'bg-secondary'; // Un color por defecto para pedidos sin tiempo definido

            if (pedidoData.timestampCreacion) {
                // Si timestampCreacion está definido, entonces calcular la diferencia de tiempo
                const tiempoCreacion = pedidoData.timestampCreacion.toDate();
                const ahora = new Date();
                diferenciaEnMinutos = (ahora.getTime() - tiempoCreacion.getTime()) / (1000 * 60);

                if (diferenciaEnMinutos <= 5) {
                    claseColorHeader = 'bg-success';
                } else if (diferenciaEnMinutos <= 10) {
                    claseColorHeader = 'bg-warning';
                } else {
                    claseColorHeader = 'bg-danger';
                }
            }

            // Consulta para verificar si existen subpedidos con estado 1
            const subPedidosQuery = query(collection(docPedido.ref, 'subPedidos'), where("estado", "==", 1));
            const subPedidosSnapshot = await getDocs(subPedidosQuery);
            if (subPedidosSnapshot.docs.length > 0) {
                // Crear la tarjeta del pedido
                const tarjetaPedido = document.createElement('div');
                tarjetaPedido.classList.add('col-sm-6', 'col-md-6', 'col-lg-4', 'col-xl-3', 'col-xxl-3', 'mb-4');
                tarjetaPedido.innerHTML = `
                    <div class="card mb-3" id="card-${pedidoId}">
                        <div class="card-header ${claseColorHeader} text-white">
                            <h5 class="card-title mb-0" style="color: black;">Pedido - ${pedidoId.slice(0, 4)}</h5>
                        </div>
                        <div class="card-body mb-0">
                            <div class="platos">
                                <!-- Aquí se cargarán los platos del pedido -->
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-success confirmar" style="margin-right: 1em;  data-pedido-id="${pedidoId}">Confirmar</button>
                                <button type="button" class="btn btn-danger eliminar"  data-card-id="card-${pedidoId}">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
                pedidosContainer.appendChild(tarjetaPedido);

                // Cargar los platos para el pedido
                cargarPlatosPedido(pedidoId, db);

                // Agregar controlador de eventos para el botón de confirmación
                const btnConfirmar = tarjetaPedido.querySelector('.btn-success');
                btnConfirmar.addEventListener('click', async () => {
                    const batch = writeBatch(db);

                    subPedidosSnapshot.docs.forEach((subPedidoDoc) => {
                        batch.update(subPedidoDoc.ref, { estado: 2 });
                    });

                    const pedidoCard = document.getElementById(`card-${pedidoId}`);
                    pedidoCard.classList.add('fade-out');
                    pedidoCard.addEventListener('animationend', async () => {
                        try {
                            await batch.commit();
                            // Eliminar la tarjeta después de la animación
                            pedidoCard.remove();
                            // Recalcular el layout de Masonry tras la eliminación de la tarjeta
                            recalcularMasonry();
                        } catch (error) {
                            console.error(`Error al confirmar el pedido ${pedidoId}: `, error);
                        }
                    }, { once: true });
                });
            }
        }
    } catch (error) {
        console.error("Error al cargar los pedidos: ", error);
    }
}
function recalcularMasonry() {
    const masonryGrid = document.querySelector('.row[data-masonry]');
    if (masonryGrid) {
        new Masonry(masonryGrid, {
            itemSelector: '.col-sm-6.col-md-6.col-lg-4.col-xl-2.col-xxl-2',
            percentPosition: true,
            transitionDuration: '0.3s' // Ajusta la duración de la transición según necesites
        });
    }
}



async function cargarPlatosPedido(pedidoId, db) {
    const pedidoRef = doc(db, 'Pedidos', pedidoId);
    const subPedidosQuery = query(collection(pedidoRef, 'subPedidos'), where("estado", "==", 1));
    const platosContainer = document.querySelector(`#card-${pedidoId} .platos`);
    let platosAgrupados = {};
    let platosIndividuales = [];

    try {
        const subPedidosSnapshot = await getDocs(subPedidosQuery);
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
                const cantidad = platoInfo.cantidad ? parseInt(platoInfo.cantidad.replace(/\D/g, '')) : 1; // Asume 1 si no hay cantidad definida

                if (platoData.comentarios) {
                    platosIndividuales.push({
                        ...platoData,
                        nombrePlato: platoInfo.nombrePlato,
                        idPlatoPath,
                        cantidad // Añade la cantidad aquí para individuales
                    });
                } else {
                    if (!platosAgrupados[idPlatoPath]) {
                        platosAgrupados[idPlatoPath] = {
                            cantidad: 0,
                            nombrePlato: platoInfo.nombrePlato
                        };
                    }
                    platosAgrupados[idPlatoPath].cantidad += cantidad; // Suma la cantidad aquí para agrupados
                }
            }
        }

        for (const [idPlatoPath, platoAgrupado] of Object.entries(platosAgrupados)) {
            const platoElement = document.createElement('div');
            platoElement.classList.add('form-check', 'mb-2');
            platoElement.innerHTML = `
                <input class="form-check-input" type="checkbox" value="" id="plato-${idPlatoPath}">
                <label class="form-check-label d-block text-break" for="plato-${idPlatoPath}">
                  ${platoAgrupado.nombrePlato} x ${platoAgrupado.cantidad}
                </label>
            `;
            platosContainer.appendChild(platoElement);
        }

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
