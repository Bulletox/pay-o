import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
    getFirestore, collection, query, where, orderBy, 
    limit, getDocs, addDoc, deleteDoc, doc, limitToLast 
  } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const carritoContainer = document.getElementById('carritoItems');
    const confirmarBtn = document.querySelector('.btn-confirmar');

    const pedidoId = "Mlpxz080j3Mb6hCS8rCm";
    const subPedidoId = "urXKVCGdjq5j36UXaijM";
    const platosPedidoId = "MAfVnS34Qi7ECq1QIe1t";

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

        const subPedidoRef = collection(db, `Pedidos/${pedidoId}/subPedido/${subPedidoId}/platosPedido/${platosPedidoId}`);
        const subPedidoSnapshot = await getDocs(subPedidoRef);

        let htmlContent = '';

        subPedidoSnapshot.forEach((doc) => {
            console.log(doc.id);
            const subPedido = doc.data();
            console.log(subPedido);
            // Verificar que el subpedido tenga estadoSubPedido igual a 0
            if (subPedido.estadoSubPedido === 0) {
                const plato = subPedido.plato;
                const platoId = subPedido.platoId;
                console.log(plato);
                const itemHtml = `
                    <div class="itemComida d-flex justify-content-between pb-1 border-bottom mb-4" data-id="${doc.id}">
                        <div class="descript d-flex flex-column">
                            <strong class="fs-3">${plato.nombrePlato}</strong>
                            <p><strong>${plato.precio}€</strong></p>
                            <div class="short">
                                <p class="ellipsis">${plato.descripcion || ''}</p>
                            </div>
                        </div>
                        <div style="height: 100%;">
                            <img src="${plato.imagenUrl || 'img/paella.png'}" alt="" height="125" width="125">
                        </div>
                        <div class="d-flex flex-column justify-content-between align-items-center ms-3">
                            <button class="btn btn-outline-danger btn-sm" onclick="eliminarItem('${doc.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

                htmlContent += itemHtml;
            }
        });

        carritoContainer.innerHTML = htmlContent;

        // Configurar evento para confirmar pedido
        confirmarBtn.addEventListener('click', async () => {
            await confirmarPedido();
        });
    } catch (error) {
        console.error(error);
    }
});

async function agregarAlCarrito(platoId) {
    const pedidoId = "Mlpxz080j3Mb6hCS8rCm";
    const subPedidoId = "urXKVCGdjq5j36UXaijM";
    const platosPedidoId = "MAfVnS34Qi7ECq1QIe1t";

    try {
        const platoRef = doc(db, `Platos/${platoId}`);
        const platoDoc = await getDoc(platoRef);

        if (platoDoc.exists()) {
            const platoData = platoDoc.data();

            const subPedidoPlatosRef = collection(db, `Pedidos/${pedidoId}/subPedido/${subPedidoId}/platosPedido/${platosPedidoId}`);
            
            await addDoc(subPedidoPlatosRef, {
                platoId: platoRef,
                plato: platoData,
                estadoSubPedido: 0, // Estado inicial del plato en el carrito
                cantidad: 1, // Cantidad inicial (puedes modificar según necesites)
            });

            // Actualizar la interfaz del carrito después de agregar el plato
            location.reload(); // Recargar la página para mostrar los cambios (no recomendado en producción)
        } else {
            console.error('El plato no existe');
        }
    } catch (error) {
        console.error('Error al agregar plato al carrito:', error);
    }
}

async function eliminarItem(itemId) {
    const pedidoId = "Mlpxz080j3Mb6hCS8rCm";
    const subPedidoId = "urXKVCGdjq5j36UXaijM";
    const platosPedidoId = "MAfVnS34Qi7ECq1QIe1t";

    try {
        const itemRef = doc(db, `Pedidos/${pedidoId}/subPedido/${subPedidoId}/platosPedido/${platosPedidoId}/${itemId}`);
        await deleteDoc(itemRef);

        // Eliminar el elemento del carrito de la interfaz sin recargar la página
        const itemElement = document.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
        }
    } catch (error) {
        console.error('Error al eliminar item del carrito:', error);
    }
}

async function confirmarPedido() {
    const pedidoId = "Mlpxz080j3Mb6hCS8rCm";
    const subPedidoId = "urXKVCGdjq5j36UXaijM";

    try {
        // Actualizar el estado del subpedido a "1" (confirmado)
        const subPedidoRef = doc(db, `Pedidos/${pedidoId}/subPedido/${subPedidoId}`);
        await updateDoc(subPedidoRef, {
            estado: 1 // Cambiar el estado del subpedido a "1" (confirmado)
        });

        alert('Pedido confirmado correctamente');
        // Redirigir a otra página, mostrar un mensaje de confirmación, etc.
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
    }
}