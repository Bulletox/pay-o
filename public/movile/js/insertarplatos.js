import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
    getFirestore, collection, query, where, orderBy, 
    limit, getDocs, addDoc, deleteDoc, doc, limitToLast 
  } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
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
    const db = getFirestore(app);
    const auth = getAuth(app);
    const uid = await iniciarSesionAnonima(auth);
    const pedidoId = 'MyKzFJ1VJKFsN56pEUjP';
    const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);
    if (!subPedidoId) {
        console.log(subPedidoId);
        console.error("No se pudo obtener un subpedido con estado '0'");
        return;
    }
    const platosPedidoRef = collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`);
    const queryParams = new URLSearchParams(window.location.search);
    const platoId = queryParams.get('plId');

    const cantidadPlatosElement = document.getElementById('cantidadPlatos');
    let cantidad = parseInt(cantidadPlatosElement.textContent, 10) || 0;

    window.sumarCantidad = () => {
        const nuevoPlato = {
            comentarios: '',
            idPlato: doc(db, `Restaurantes/Restaurantes/Platos/${platoId}`),
            usuario: uid,
        };
        addDoc(platosPedidoRef, nuevoPlato).then(docRef => {
            console.log("Plato agregado con ID: ", docRef.id);
            cantidad++;
            cantidadPlatosElement.textContent = cantidad;
        }).catch(error => {
            console.error("Error al agregar plato: ", error);
        });
    };

    window.restarCantidad = () => {
        if (cantidad > 0) {
            getDocs(query(platosPedidoRef, orderBy('timestamp'), limitToLast(1)))
                .then(snapshot => {
                    if (!snapshot.empty) {
                        const lastDoc = snapshot.docs[0];
                        deleteDoc(doc(db, platosPedidoRef.path, lastDoc.id)).then(() => {
                            console.log("Plato eliminado con ID: ", lastDoc.id);
                            cantidad--;
                            cantidadPlatosElement.textContent = cantidad;
                        });
                    }
                }).catch(error => {
                    console.error("Error al eliminar el último plato: ", error);
                });
        }
    };    
});

async function buscarUltimoSubpedidoConEstadoCero(pedidoId, db) {
    const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
    console.log(subpedidosRef)
    const subColeccionesSnapshot = await getDocs(subpedidosRef);
    console.log("Subcolecciones:", subColeccionesSnapshot.docs.map(doc => doc.id));
    try {

        const snapshot = await getDocs(query(subpedidosRef, where('estado', '==', 0), limit(1)));
        if (!snapshot.empty) {
            console.log("Subpedidos con estado '0':", snapshot.docs.map(doc => doc.id));
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
