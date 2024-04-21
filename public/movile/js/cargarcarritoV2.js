import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    limit,
    orderBy
  } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const platosContainer = document.getElementById('platosContainer');
    
    if (!platosContainer) {
        console.error("El elemento 'platosContainer' no existe en el DOM.");
        return;
    }

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

    // Obtiene los parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const pedidoId = queryParams.get('pId'); // Asumiendo que 'pId' es el ID del pedido en la URL
    const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db); 
    try {
        const platosPedidoSnapshot = await getDocs(collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`));
        const conteoPlatos = {};

        for (const docPlato of platosPedidoSnapshot.docs) {
            const platoData = docPlato.data();
            const platoRef = platoData.idPlato; // Esta es la referencia del documento

            if (!platoRef) {
                console.error(`La referencia del plato es undefined en el documento: ${docPlato.id}`);
                continue; // Salta este plato y continúa con el siguiente
            }

            try {
                const platoDocSnapshot = await getDoc(platoRef);
                if (!platoDocSnapshot.exists()) {
                    console.error(`No se encontró el plato con la referencia: ${platoRef.path}`);
                    continue;
                }

                const plato = platoDocSnapshot.data();
                const nombrePlato = plato.nombrePlato; // Asume que el campo se llama 'nombrePlato'

                conteoPlatos[nombrePlato] = (conteoPlatos[nombrePlato] || 0) + 1;
            } catch (error) {
                console.error(`Error al obtener el documento del plato: ${error}`);
            }
        }

        // Crea el HTML para listar los platos
        let htmlContent = '';
        Object.entries(conteoPlatos).forEach(([nombrePlato, cantidad]) => {
            htmlContent += `
                <div class="platoItem">
                    <strong>Plato: ${nombrePlato}</strong>
                    <p>Cantidad: ${cantidad}</p>
                </div>
            `;
        });

        // Inserta el HTML en el contenedor
        platosContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error("Error al listar platos: ", error);
    }
});

async function buscarUltimoSubpedidoConEstadoCero(pedidoId, db) {
    const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
    
    try {
        // Asegúrate de que 'query', 'where', y 'limit' estén correctamente importadas para poder usarlas aquí
        const q = query(subpedidosRef, where('estado', '==', 0), orderBy('timestampCreacion', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const ultimoSubpedido = snapshot.docs[0];
            console.log("Último subpedido con estado '0':", ultimoSubpedido.id);
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