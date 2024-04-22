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
            precio: nuevoPrecio
        };
        // Asignar cada alérgeno a su campo correspondiente en el objeto platoData
        listaAlergenos.forEach((alergeno, index) => {
            platoData[`alergenos${index === 0 ? '' : index + 1}`] = alergeno;
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