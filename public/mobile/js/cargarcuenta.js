import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, query, where, limit, orderBy, onSnapshot, updateDoc, doc, Timestamp, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

async function buscarSubpedidosConEstadoCero(pedidoId, db) {
    const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
    const q = query(subpedidosRef, where('estado', '==', 2));
    try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Error al buscar los subpedidos con estado '0':", error);
        return [];
    }
}
// Obtiene todos los subpedidos con estado 0
document.addEventListener('DOMContentLoaded', async () => {
    // Asegúrate de que el identificador aquí coincida exactamente con el que está en el HTML
    const productsContainer = document.getElementById('products');

    if (!productsContainer) {
        console.error("El elemento 'products' no existe en el DOM.");
        return;
    }

    // Obtiene los parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const pedidoId = queryParams.get('pId');

    // Obtiene los IDs de todos los subpedidos con estado 0
    const subPedidoIds = await buscarSubpedidosConEstadoCero(pedidoId, db);

    if (subPedidoIds.length === 0) {
        console.error('No se encontraron subpedidos con estado 0.');
        console.error('Creando un nuevo subpedido...');
        crearSubPedido(pedidoId, db); // Crear un nuevo subpedido
        return;
    }

    subPedidoIds.forEach(subPedidoId => {
        // Suscribe a los cambios de la colección de platos de cada subpedido
        const unsub = onSnapshot(collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`), (snapshot) => {
            const conteoPlatos = {}; // Reiniciar el contador de platos cada vez
            const confirmarBtn = document.getElementById('confirmarPedidoBtn');
            confirmarBtn.addEventListener('click', () => {
                confirmarPedido(pedidoId, db, unsub);
            });
            snapshot.docs.forEach((doc) => {
                const platoData = doc.data();
                const platoRef = platoData.idPlato; // Esta es la referencia del documento
                const pagado = platoData.pagado; // Asume que el campo se llama 'pagado'
    
                if (platoRef && !pagado) { // Solo procesar si el plato no está pagado
                    getDoc(platoRef).then(platoDocSnapshot => {
                        if (platoDocSnapshot.exists()) {
                            const plato = platoDocSnapshot.data();
                            const nombrePlato = plato.nombrePlato; // Asume que el campo se llama 'nombrePlato'
                            const imagenUrl = plato.imagenUrl; // Asume que el campo se llama 'imagenUrl'
                            const precio = plato.precio; // Asume que el campo se llama 'precio'
    
                            // Actualizar el conteo acumulativo de platos
                            if (!conteoPlatos[nombrePlato]) {
                                conteoPlatos[nombrePlato] = {
                                    count: 0,
                                    imageUrl: imagenUrl,
                                    totalPrecio: 0
                                };
                            }
                            conteoPlatos[nombrePlato].count += 1;
                            conteoPlatos[nombrePlato].totalPrecio = conteoPlatos[nombrePlato].count * precio;
    
                            // Actualizar la UI
                            updateUI(conteoPlatos, productsContainer); // Pasa el contenedor como argumento a la función
                        } else {
                            console.error(`No se encontró el plato con la referencia: ${platoRef.path}`);
                        }
                    });
                }
            });
        }, (error) => {
            console.error("Error al escuchar los cambios: ", error);
        });
    });
});

function updateUI(conteoPlatos, productsContainer) {
    let htmlContent = '';
    let subtotalSinIVA = 0;
    const IVA_RATE = 0.10;  // Tasa del IVA del 10%

    // Calcular el subtotal sin IVA
    Object.entries(conteoPlatos).forEach(([nombrePlato, data]) => {
        const { count, imageUrl, totalPrecio } = data;
        subtotalSinIVA += totalPrecio; // Suma del precio de todos los platos sin IVA

        htmlContent += `
        <div class="product">
    <img src="${imageUrl || 'img/paella.png'}" class="img-fluid rounded" alt="" style="width: 60px; height: 60px;">
    <div>
        <span>${nombrePlato}</span>
    </div>
    <div class="quantity">
        <!-- <button>
            <svg fill="none" viewBox="0 0 24 24" height="14" width="14"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b"
                    d="M20 12L4 12"></path>
            </svg>
        </button> -->
        <label>${count}</label>
        <!-- <button>
            <svg fill="none" viewBox="0 0 24 24" height="14" width="14"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#47484b"
                    d="M12 4V20M20 12H4"></path>
            </svg>
        </button> -->
    </div>
    <label class="price small">${totalPrecio.toFixed(2)}€</label>
</div>
        `;
    });

    const IVA = subtotalSinIVA * IVA_RATE; // Calcular el IVA
    const totalConIVA = subtotalSinIVA + IVA; // Calcular el total con IVA

    // Agregar el HTML para mostrar subtotal, IVA y total
    const subtotalElement = document.querySelector('.details span:nth-child(2)');
    const ivaElement = document.querySelector('.details span:nth-child(4)');
    const totalElement = document.querySelector('.checkout--footer .price');

    if (subtotalElement && ivaElement && totalElement) {
        subtotalElement.textContent = `${subtotalSinIVA.toFixed(2)}€`;
        ivaElement.textContent = `${IVA.toFixed(2)}€`;
        totalElement.textContent = `${totalConIVA.toFixed(2)}€`;
    }

    const confirmarBtn = document.getElementById('confirmarPedidoBtn');
    confirmarBtn.disabled = Object.keys(conteoPlatos).length === 0;
    productsContainer.innerHTML = htmlContent;
}

