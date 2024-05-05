import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, query, where, limit, orderBy, onSnapshot, updateDoc, doc, Timestamp, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
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
const auth = getAuth(app);
// Obtiene la referencia de Firestore
const db = getFirestore(app);

async function buscarSubpedidosConEstado2(pedidoId, db) {
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
// Obtiene todos los subpedidos con estado 2
document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) {
        console.error("El elemento 'products' no existe en el DOM.");
        return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const pedidoId = queryParams.get('pId');
    const usuarioId = await iniciarSesionAnonima(auth);
    let esPagoPersonal = false; // Declaración inicial, falsa por defecto.

    const radios = document.querySelectorAll('input[type="radio"][name="radio"]');

    radios.forEach(radio => {
        radio.addEventListener('change', async () => {
            // Esta línea asegura que esPagoPersonal se actualiza correctamente según el estado del radio
            esPagoPersonal = radio.nextElementSibling.textContent.trim() === "PAGAR LO TUYO";
            console.log(`Radio changed: esPagoPersonal is now ${esPagoPersonal}`);
            await cargarPlatos(pedidoId, usuarioId, esPagoPersonal, productsContainer, db);
        });
    });

    // Carga inicial de todos los platos
    await cargarPlatos(pedidoId, usuarioId, esPagoPersonal, productsContainer, db);
});

async function cargarPlatos(pedidoId, usuarioId, esPagoPersonal, productsContainer, db) {
    const subPedidoIds = await buscarSubpedidosConEstado2(pedidoId, db);
    let conteoGlobalPlatos = {};

    for (const subPedidoId of subPedidoIds) {
        const unsubscribe = onSnapshot(collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`), snapshot => {
            snapshot.docs.forEach(async documentSnapshot => {
                const platoData = documentSnapshot.data();
                if (!esPagoPersonal || (esPagoPersonal && platoData.usuario === usuarioId)) {
                    if (platoData.idPlato && !platoData.pagado) {
                        try {
                            const platoDocSnapshot = await getDoc(platoData.idPlato);
                            if (platoDocSnapshot.exists()) {
                                const plato = platoDocSnapshot.data();
                                if (plato && plato.nombrePlato && plato.imagenUrl && typeof plato.precio === 'number') {
                                    const { nombrePlato, imagenUrl, precio } = plato;
                                    if (!conteoGlobalPlatos[nombrePlato]) {
                                        conteoGlobalPlatos[nombrePlato] = {
                                            count: 0,
                                            imageUrl: imagenUrl,
                                            totalPrecio: 0
                                        };
                                    }
                                    conteoGlobalPlatos[nombrePlato].count += 1;
                                    conteoGlobalPlatos[nombrePlato].totalPrecio += precio;
                                    updateUI(conteoGlobalPlatos, productsContainer);
                                }
                            } else {
                                console.error(`No se encontró el plato con la referencia dada.`);
                            }
                        } catch (error) {
                            console.error('Error al obtener datos del plato:', error);
                        }
                    }
                }
            });
        }, error => {
            console.error("Error al escuchar los cambios: ", error);
        });
    }
}

function updateUI(conteoPlatos, productsContainer) {
    let htmlContent = '';
    let subtotalSinIVA = 0;
    const IVA_RATE = 0.10;

    Object.entries(conteoPlatos).forEach(([nombrePlato, data]) => {
        const { count, imageUrl, totalPrecio } = data;
        subtotalSinIVA += totalPrecio;
        htmlContent += `
        <div class="product">
            <img src="${imageUrl}" class="img-fluid rounded" alt="${nombrePlato}" style="width: 60px; height: 60px; object-fit: cover;">
            <div><span>${nombrePlato}</span></div>
            <div class="quantity"><label>${count}</label></div>
            <label class="price small">${totalPrecio.toFixed(2)}€</label>
        </div>`;
    });

    const IVA = subtotalSinIVA * IVA_RATE;
    const totalConIVA = subtotalSinIVA + IVA;

    productsContainer.innerHTML = htmlContent;
    document.querySelector('.details span:nth-child(2)').textContent = `${subtotalSinIVA.toFixed(2)}€`;
    document.querySelector('.details span:nth-child(4)').textContent = `${IVA.toFixed(2)}€`;
    document.querySelector('.checkout--footer .price').textContent = `${totalConIVA.toFixed(2)}€`;
}





async function iniciarSesionAnonima(auth) {
    try {
        const result = await signInAnonymously(auth); // usar `signInAnonymously` importada y `auth`
        console.log('Usuario anónimo conectado', result.user.uid);
        return result.user.uid;
    } catch (error) {
        console.error('Error en inicio de sesión anónimo', error);
        return null;
    }
}



