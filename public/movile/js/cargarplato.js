import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const platoCon = document.getElementById('platoCon');
    
    // Usar URLSearchParams para obtener el ID del plato de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const platoId = queryParams.get('plId');  // Obtiene el platoId de la URL

    if (!platoId) {
        console.error('No se proporcionó el ID del plato en la URL');
        platoCon.innerHTML = '<p>Error: No se proporcionó el ID del plato.</p>';
        return;
    }

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

        // Obtener el documento del plato específico por su ID
        const platoDocRef = doc(db, 'Restaurantes', 'Restaurantes', 'Platos', platoId);
        const platoDocSnap = await getDoc(platoDocRef);

        if (platoDocSnap.exists()) {
            const plato = platoDocSnap.data();

            // Generar HTML del plato específico
            const htmlPlato = `
                <div class="contenedorPadre d-flex flex-column">
                    <div class="contenedorIMG d-flex justify-content-start" style="width: 100%; height: 100%; overflow:hidden">
                        <i class="bi bi-arrow-left-circle-fill cursor-pointer position-fixed fs-2 text-light p-3" onclick="goBack()"></i>
                        <img class="w-100" src="${plato.imagenUrl}" alt="" style="max-height: 35vh; object-fit: cover;">
                    </div>
                    <div class="p-3" id="platoCon">
                        <div class="d-flex justify-content-between align-items-center" style="height: 2em !important; ">
                            <h1 class="nombre">${plato.nombrePlato}</h1>
                            <div class="d-flex flex-row align-items-center justify-content-around fs-2">

                            <i class="bi bi-dash-circle cursor-pointer pe-4" onclick="restarCantidad()"></i>
                            <!-- Cantidad actual -->
                            <p class="mb-4" id="cantidadPlatos">1</p>
                            <!-- Botón de Sumar -->
                            <i class="bi bi-plus-circle cursor-pointer ps-4" onclick="sumarCantidad()"></i>
                                
                            </div>
                        </div>
                        <p class="precio">${plato.precio} €</p>
                        <p>${plato.descripcion}</p>
                    </div>
                    <div class="d-flex w-100" style="background-color: #f7f7f7; height: 10px;">.</div>
                    <div class="info p-3 vh-50" style="border-radius: 0.5em; background-color: #ffffff; margin: 0; padding: 0; height: 100%;">
                        <div class="d-flex flex-row justify-content-between">
                            <h1 class="alergias">Alérgenos:</h1>
                            <a href="alergias.html"><img src="img/advertencia.png" alt="" height="25" width="25"></a>
                        </div>
                        <div class="d-flex imgAlergias d-flex flex-row mb-4 flex-wrap">
                        <img class="" src="${plato.Alergenos}" alt="" height=44 width=44 style="object-fit: cover;">
                        <img class="" src="${plato.Alergenos1}" alt="" height=44 width=44 style="object-fit: cover;">
                        <img class="" src="${plato.Alergenos2}" alt="" height=44 width=44 style="object-fit: cover;">
                        <img class="" src="${plato.Alergenos3}" alt="" height=44 width=44 style="object-fit: cover;">
                        </div>
                        <h1>Cantidad:</h1>
                        <p class="mb-4">${plato.Cantidad}</p>
                        <h1>Ingredientes:</h1>
                        <p class="mb-4" style="padding-bottom: 5em;">${plato.Ingredientes}</p>
                    </div>
                    <div class="abajo d-flex flex-row justify-content-center position-fixed fixed-bottom">
                    <button class="btn btn-primary d-flex justify-content-center align-items-center w-100 p-4 border rounded-0 fs-2"
                        style="max-height: 74px !important;">Añadir ${plato.precio} €</button>
                    </div>
                </div>
            `;

             // Insertar el HTML generado en el contenedor de platos
             platoCon.innerHTML = htmlPlato;

             // Función para sumar la cantidad
             const cantidadPlatosElement = document.getElementById('cantidadPlatos');
             const precioPlato = plato.precio;
 
             let cantidad = 1; // Cantidad inicial
             let precioTotal = precioPlato * cantidad; // Precio total inicial
 
             const actualizarCantidadYPrecio = () => {
                cantidadPlatosElement.textContent = cantidad;
                const precioTexto = `${precioTotal.toFixed(2)} €`;
                document.querySelector('.precio').textContent = precioTexto; // Actualizar el precio fuera del botón
                document.querySelector('.btn.btn-primary').textContent = `Añadir ${precioTexto}`; // Actualizar el texto del botón
            };
            
 
             window.sumarCantidad = () => {
                 cantidad++;
                 precioTotal = precioPlato * cantidad;
                 actualizarCantidadYPrecio();
             };
 
             window.restarCantidad = () => {
                 if (cantidad > 1) {
                     cantidad--;
                     precioTotal = precioPlato * cantidad;
                     actualizarCantidadYPrecio();
                 }
             };
 
             actualizarCantidadYPrecio(); // Actualizar la cantidad y el precio inicialmente
         } else {
             console.log('No se encontró el plato con la ID especificada.');
         }
 
     } catch (error) {
         console.error(error);
     }
 });
