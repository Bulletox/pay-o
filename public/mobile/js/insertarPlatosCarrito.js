import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
    authDomain: "dam2pay-o.firebaseapp.com",
    projectId: "dam2pay-o",
    storageBucket: "dam2pay-o.appspot.com",
    messagingSenderId: "1010112748895",
    appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
    measurementId: "G-H36HTF38QD",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const uid = await iniciarSesionAnonima(auth);

  const queryParams = new URLSearchParams(window.location.search);

  const pedidoId = queryParams.get("pId");
  if (!pedidoId) {
    console.error("No se proporcionó el ID del pedido en la URL");
    return;
  }

  const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);
  if (!subPedidoId) {
    console.log(subPedidoId);
    console.error("No se pudo obtener un subpedido con estado '0'");
    return;
  }


  const platosPedidoRef = collection(
    db,
    `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`
  );
  // Función para sumar cantidades a un plato
  window.sumarCantidad = (idPlato) => {
    const botonSumar = document.querySelector(`#sumar-${idPlato}`);
    botonSumar.classList.add("disabled"); // Deshabilitar botón visualmente mientras se procesa la solicitud

    const nuevoPlato = {
      comentarios: "",
      idPlato: doc(db, `Restaurantes/Restaurantes/Platos/${idPlato}`),
      usuario: uid,
      timestamp: new Date(),
      pagado: false,
    };

    addDoc(platosPedidoRef, nuevoPlato)
      .then((docRef) => {
        console.log("Plato agregado con ID: ", docRef.id);
        let cantidad =
          parseInt(
            document.getElementById(`cantidadPlatosUsuario-${idPlato}`)
              .textContent
          ) || 0;
        cantidad++; // Incrementar la cantidad
        // document.getElementById(
        //   `cantidadPlatosUsuario-${idPlato}`
        // ).textContent = cantidad; // Actualizar el DOM
        botonSumar.classList.remove("disabled"); // Re-habilitar el botón
      })
      .catch((error) => {
        console.error("Error al agregar plato: ", error);
        botonSumar.classList.remove("disabled"); // Re-habilitar el botón en caso de error
      });
  };

  // Función para restar cantidades de un plato
  window.restarCantidad = async (idPlato) => {
    const botonRestar = document.querySelector(`#restar-${idPlato}`);
    botonRestar.classList.add("disabled"); // Deshabilitar botón visualmente mientras se procesa la solicitud

    let cantidad =
      parseInt(
        document.getElementById(`cantidadPlatosUsuario-${idPlato}`).textContent
      ) || 0;
    if (cantidad > 0) {
      console.log("Eliminando último plato...");
      const q = query(
        platosPedidoRef,
        where("usuario", "==", uid),
        where(
          "idPlato",
          "==",
          doc(db, `Restaurantes/Restaurantes/Platos/${idPlato}`)
        ),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const lastDoc = snapshot.docs[0];
        await deleteDoc(doc(db, `${platosPedidoRef.path}/${lastDoc.id}`));
        console.log("Plato eliminado con ID: ", lastDoc.id);
        cantidad--; // Decrementar la cantidad
        // document.getElementById(
        //   `cantidadPlatosUsuario-${idPlato}`
        // ).textContent = cantidad; // Actualizar el DOM
      } else {
        console.log("No hay platos que coincidan para eliminar.");
      }
      botonRestar.classList.remove("disabled"); // Re-habilitar el botón
    } else {
      botonRestar.classList.remove("disabled"); // Asegurarse de re-habilitar el botón si no se realiza ninguna acción
    }
  };
});

async function buscarUltimoSubpedidoConEstadoCero(pedidoId, db) {
  const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
//   console.log(subpedidosRef);
  const subColeccionesSnapshot = await getDocs(subpedidosRef);
//   console.log(
//     "Subcolecciones:",
//     subColeccionesSnapshot.docs.map((doc) => doc.id)
//   );
  try {
    const snapshot = await getDocs(
      query(subpedidosRef, where("estado", "==", 0), limit(1))
    );
    if (!snapshot.empty) {
      console.log(
        "Subpedidos con estado '0':",
        snapshot.docs.map((doc) => doc.id)
      );
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
    console.log("Usuario anónimo conectado", result.user.uid);
    return result.user.uid;
  } catch (error) {
    console.error("Error en inicio de sesión anónimo", error);
    return null;
  }
}
