// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Import Firestore functions

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

const alergenosUrls = {
    "Cacahuete": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Falergia-a-los-cacahuetes.png?alt=media&token=a1008172-37aa-462b-9c34-bca534bcee40",
    "Altramuces": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Faltramuces.png?alt=media&token=9ddf297f-39c2-484c-9ded-a2276fc12da7",
    "Apio": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fapio.png?alt=media&token=1cae102d-0808-4d53-9678-2243be447f90",
    "Moluscos": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fcascara.png?alt=media&token=aa35c56d-d091-4d9c-942c-c06778d4c506",
    "Crustaceo": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fcrustaceo.png?alt=media&token=676b6f97-edf9-44ad-832e-66fcb12413ac",
    "Gluten": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fgluten%201.png?alt=media&token=122784c2-8ae5-499d-b15c-7b9ae9783d85",
    "Soja": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fhaba-de-soja.png?alt=media&token=ad61ead1-3515-4193-882d-4aed7e6629ba",
    "Huevo": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fhuevo.png?alt=media&token=13153199-5a51-4788-bea0-c2ef4f5fe5de",
    "Mostaza": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fmostaza.png?alt=media&token=59fb009d-4a50-4b9f-a61f-5d8abe11569c",
    "Nuez": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fnuez.png?alt=media&token=cb67da27-c232-4f3a-bdb3-448c97f2e2c4",
    "Pescado": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fpescado.png?alt=media&token=faeb74c7-f035-4ed5-b6ba-8d3e0684f3bc",
    "Lácteos": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fproductos-lacteos.png?alt=media&token=e38e0fda-ea61-4d77-af35-3258ff628c7c",
    "Sésamo": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fsesamo.png?alt=media&token=dad19c45-1d46-4f83-bcda-9029ddb83784",
    "Dióxido azufre y sulfitos": "https://firebasestorage.googleapis.com/v0/b/dam2pay-o.appspot.com/o/Al%C3%A9rgenos%2Fpentagono.png?alt=media&token=54f50553-42cb-444f-af56-7618fcb74ed8"
};

// Función para crear un nuevo plato en un restaurante específico
const crearNuevoPlato = async () => {
    try {
        // Obtener los valores de los atributos placeholder de los elementos HTML
        const nuevoNombre = document.getElementById('nuevoNombre').value;
        const nuevoPrecio = document.getElementById('nuevoPrecio').value;
        const nuevaDescripcion = document.getElementById('nuevaDescripcion').value;
        const inputComida = document.getElementById('inputComida').getAttribute('placeholder');
        const cantidadComida = document.getElementById('cantidad').getAttribute('placeholder');
        const alergenos = document.getElementById('alergenos').value;
        const ingredientes = document.getElementById('ingredientes').value;

        // Determinar la categoría según el valor de inputComida
        let categoria;
        if (inputComida === 'Comida') {
            categoria = 0;
        } else if (inputComida === 'Bebida') {
            categoria = 1;
        } else {
            console.error('El valor de inputComida no es válido');
            return;
        }

        // Dividir la cadena de alérgenos en palabras
        const listaAlergenos = alergenos.split(',').map(alergeno => alergeno.trim());

        // Obtener una referencia directa al restaurante en el que deseas crear el plato
        const restaurantesSnapshot = await getDocs(collection(db, 'Restaurantes'));
        const primerRestauranteDoc = restaurantesSnapshot.docs[0];
        const platosCollectionRef = collection(primerRestauranteDoc.ref, 'Platos');

        // Obtener la referencia a la colección de "Platos" dentro del restaurante específico

        // Crear un nuevo documento de plato con un ID automático
        const platoData = {
            nombrePlato: nuevoNombre,
            descripcion: nuevaDescripcion,
            categoria: categoria,
            Cantidad: cantidadComida,
            Ingredientes: ingredientes,
            precio: nuevoPrecio,
            imagenUrl: null
        };
        // Asignar cada alérgeno a su campo correspondiente en el objeto platoData
        listaAlergenos.forEach((alergeno, index) => {
            // Verificar si el alérgeno está en el objeto alergenosUrls
            if (alergenosUrls.hasOwnProperty(alergeno)) {
                platoData[`Alergenos${index === 0 ? '' : index + 1}`] = alergenosUrls[alergeno];
            } else {
                console.warn(`El alérgeno "${alergeno}" no está definido en la lista de URLs.`);
            }
        });

        await addDoc(platosCollectionRef, platoData);
        console.log('Nuevo plato creado exitosamente.');
    } catch (error) {
        console.error('Error al crear el nuevo plato:', error);
    }
};

// Obtener referencia al botón "Crear nuevo plato"
const botonCrearPlato = document.getElementById('crearPlato');

// Agregar un event listener al botón para ejecutar la función cuando se haga clic
botonCrearPlato.addEventListener('click', crearNuevoPlato);