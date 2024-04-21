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
    
    
    const queryParams = new URLSearchParams(window.location.search);

    const platoId = queryParams.get('plId');
    if (!platoId) {
        console.error('No se proporcionó el ID del plato en la URL');
        return;
    }

    const pedidoId = queryParams.get('pId');
    if (!pedidoId) {
        console.error('No se proporcionó el ID del pedido en la URL');
        return;
    }
    

    const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);
    if (!subPedidoId) {
        console.log(subPedidoId);
        console.error("No se pudo obtener un subpedido con estado '0'");
        return;
    }
    const cantidadPlatosElement = document.getElementById('cantidadPlatos');
    let cantidad = parseInt(cantidadPlatosElement.textContent, 10) || 0;
    const platosPedidoRef = collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`);
    window.sumarCantidad = () => {
        const botonSumar = document.querySelector('.bi-plus-circle'); // Selecciona el ícono por su clase
        botonSumar.classList.add('disabled'); // Agrega una clase 'disabled' para visualizar que está desactivado
    
        const nuevoPlato = {
            comentarios: '',
            idPlato: doc(db, `Restaurantes/Restaurantes/Platos/${platoId}`),
            usuario: uid,
            timestamp: new Date()
        };
    
        addDoc(platosPedidoRef, nuevoPlato).then(docRef => {
            console.log("Plato agregado con ID: ", docRef.id);
            cantidad++;
            document.getElementById('cantidadPlatos').textContent = cantidad;
            botonSumar.classList.remove('disabled'); // Quita la clase 'disabled' cuando se completa la acción
        }).catch(error => {
            console.error("Error al agregar plato: ", error);
            botonSumar.classList.remove('disabled'); // Asegúrate de quitar la clase 'disabled' incluso si hay un error
        });
    };
    
    
    window.restarCantidad = async () => {
        const botonRestar = document.querySelector('.bi-dash-circle'); // Selecciona el ícono por su clase
        botonRestar.classList.add('disabled'); // Deshabilita visualmente el botón
    
        console.log("Cantidad actual: ", cantidad);
        if (cantidad > 0) {
            console.log("Eliminando último plato...");
            const q = query(
                platosPedidoRef,
                where('usuario', '==', uid),
                where('idPlato', '==', doc(db, `Restaurantes/Restaurantes/Platos/${platoId}`)),
                orderBy('timestamp', 'desc'),
                limitToLast(1)
            );
            const snapshot = await getDocs(q);
    
            if (!snapshot.empty) {
                const lastDoc = snapshot.docs[0];
                await deleteDoc(doc(db, `${platosPedidoRef.path}/${lastDoc.id}`));
                console.log("Plato eliminado con ID: ", lastDoc.id);
                cantidad--;
                document.getElementById('cantidadPlatos').textContent = cantidad;
            } else {
                console.log("No hay platos que coincidan para eliminar.");
            }
            botonRestar.classList.remove('disabled'); // Habilita visualmente el botón
        } else {
            botonRestar.classList.remove('disabled'); // Asegúrate de quitar la deshabilitación si no se realiza ninguna acción
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
