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
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
  authDomain: "dam2pay-o.firebaseapp.com",
  projectId: "dam2pay-o",
  storageBucket: "dam2pay-o.appspot.com",
  messagingSenderId: "1010112748895",
  appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
  measurementId: "G-H36HTF38QD",
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la referencia de Firestore
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const platosContainer = document.getElementById("platosContainer");
  if (!platosContainer) {
    console.error("El elemento 'platosContainer' no existe en el DOM.");
    return;
  }

  const queryParams = new URLSearchParams(window.location.search);
  const pedidoId = queryParams.get("pId");

  // Obtiene el ID del último subpedido con estado 0
  const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);
  if (!subPedidoId) {
    console.error("No se pudo obtener el último subpedido con estado 0.");
    console.error("Creando un nuevo subpedido...");
    crearSubPedido(pedidoId, db); // Crear un nuevo subpedido
    return;
  }

  // Suscribir a los cambios de la colección de platos del subpedido
  const unsub = onSnapshot(
    collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`),
    (snapshot) => {
      const conteoPlatos = {}; // Reiniciar el contador de platos cada vez
      snapshot.docs.forEach((doc) => {
        const platoData = doc.data();
        const platoRef = platoData.idPlato; // Esta es la referencia del documento
        if (platoRef) {
          getDoc(platoRef).then((platoDocSnapshot) => {
            if (platoDocSnapshot.exists()) {
              const plato = platoDocSnapshot.data();
              const nombrePlato = plato.nombrePlato; // Asume que el campo se llama 'nombrePlato'
              const imagenUrl = plato.imagenUrl; // Asume que el campo se llama 'imagenUrl'
              const idPlato = platoData.idPlato.id; // Obtiene el ID del documento del plato

              // Actualizar el conteo acumulativo de platos
              if (!conteoPlatos[idPlato]) {
                conteoPlatos[idPlato] = {
                  nombre: nombrePlato,
                  count: 0,
                  imageUrl: imagenUrl,
                };
              }
              conteoPlatos[idPlato].count += 1;

              // Actualizar la UI
              updateUI(conteoPlatos);
            } else {
              console.error(`No se encontró el plato con la referencia: ${platoRef.path}`);
            }
          });
        }
      });
    },
    (error) => {
      console.error("Error al escuchar los cambios: ", error);
    }
  );

  // Asignar manejador de eventos al botón confirmar solo una vez
  const confirmarBtn = document.getElementById('confirmarPedidoBtn');
  if (confirmarBtn) {
    confirmarBtn.removeEventListener('click', confirmarPedidoHandler);
    confirmarBtn.addEventListener('click', confirmarPedidoHandler);
  }

  function confirmarPedidoHandler() {
    confirmarPedido(pedidoId, db, unsub);
  }

  function updateUI(conteoPlatos) {
    let htmlContent = "";
    Object.entries(conteoPlatos).forEach(([idPlato, data]) => {
      const { nombre, count, imageUrl } = data;
      htmlContent += `
<div class="card mb-4 shadow-sm" style="padding: 10px; box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.3);">
  <div class="card-body d-flex justify-content-between">
    <div>
      <h5 class="card-title">${nombre}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Cantidad:</h6>
      <div class="d-flex align-items-center">
        <button class="btn btn-outline-secondary btn-sm" id="restar-${idPlato}" onclick="restarCantidad('${idPlato}')">
          <i class="bi bi-dash-circle"></i>
        </button>
        <span class="mx-3 fs-4" id="cantidadPlatosUsuario-${idPlato}">${count}</span>
        <button class="btn btn-outline-secondary btn-sm" id="sumar-${idPlato}" onclick="sumarCantidad('${idPlato}')">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
      <div class="mt-2">
        <h6 class="text-muted">Cantidad Total <strong id="cantidadTotalComensales-${idPlato}">${count}</strong></h6>
      </div>
    </div>
    <img src="${imageUrl || 'img/paellaperomejor.png'}" class="img-fluid rounded" alt="${nombre}" style="height: 125px; width: 125px;">
  </div>
</div>`;
    });

    platosContainer.innerHTML = htmlContent;
    const cssLink = document.querySelector('link[href="css/loader_coffe.css"]');
    if (cssLink) {
      cssLink.remove();
    }
  }
});

async function buscarUltimoSubpedidoConEstadoCero(pedidoId, db) {
  const subpedidosRef = collection(db, `/Pedidos/${pedidoId}/subPedidos`);
  const q = query(
    subpedidosRef,
    where("estado", "==", 0),
    orderBy("timestampCreacion", "desc"),
    limit(1)
  );
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

async function confirmarPedido(pedidoId, db, unsub) {
  console.log("Inicio de la confirmación del pedido...");
  const subPedidoId = await buscarUltimoSubpedidoConEstadoCero(pedidoId, db);

  if (!subPedidoId) {
    console.log("No hay subpedido en estado 0 para confirmar.");
    alert("No hay subpedido para confirmar.");
    return;
  }

  // Verifica si hay platos en el subpedido
  const platosRef = collection(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}/platosPedido`);
  const snapshotPlatos = await getDocs(platosRef);

  // Filtra los documentos para verificar si alguno tiene datos
  const platosValidos = snapshotPlatos.docs.filter(doc => Object.keys(doc.data()).length > 0);

  if (platosValidos.length === 0) {
    console.error("El subpedido no contiene platos válidos para confirmar.");
    alert("Por favor, añade platos en el menu para completar tu pedido.");


    return;
  }

  const subPedidoRef = doc(db, `Pedidos/${pedidoId}/subPedidos/${subPedidoId}`);

  try {
    console.log("Actualizando el estado del subpedido...");
    await updateDoc(subPedidoRef, {
      estado: 1, // Cambiar el estado del subpedido a "1" (confirmado)
    });

    console.log("Verificando si es necesario crear un nuevo subpedido...");
    await verificarYCrearSubPedido(pedidoId, db);
    unsub(); // Detener la escucha de cambios en la colección de platosPedido
    alert("Pedido confirmado correctamente");
    window.history.back();
  } catch (error) {
    console.error("Error al confirmar el pedido:", error);
  }
}



async function verificarYCrearSubPedido(idPedido, db) {
  const subPedidosRef = collection(db, `/Pedidos/${idPedido}/subPedidos`);
  try {
    const querySnapshot = await getDocs(
      query(subPedidosRef, where("estado", "==", 0))
    );
    console.log("Verificación de subpedidos en estado 0...");

    if (querySnapshot.empty) {
      console.log("No hay subpedidos en estado 0, creando uno nuevo...");
      await crearSubPedido(idPedido, db);
    } else {
      console.log(
        "Ya existe un subPedido en estado 0, no se creará uno nuevo. Subpedidos actuales:", 
        querySnapshot.docs.map(doc => doc.id)
      );
    }
  } catch (error) {
    console.error("Error al verificar subpedidos: ", error);
  }
}

async function crearSubPedido(idPedido, db) {
  const subPedidosRef = collection(db, `/Pedidos/${idPedido}/subPedidos`);
  let estadoSubPedido = 0; // Estado inicial para el subPedido
  let timestampCreacionSubPedido = Timestamp.fromDate(new Date()); // Fecha y hora actual

  // Creación del nuevo subPedido
  const docRefSubPedido = await addDoc(subPedidosRef, {
    estado: estadoSubPedido,
    timestampCreacion: timestampCreacionSubPedido,
  });
  console.log("SubPedido creado con ID: ", docRefSubPedido.id);
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