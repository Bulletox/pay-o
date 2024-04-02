// // const firebaseConfig = {
// //     apiKey: "AIzaSyCXgWg0zUv9eTmeI0rcAw5tIMOGi4MdUlQ",
// //     authDomain: "dam2pay-o.firebaseapp.com",
// //     projectId: "dam2pay-o",
// //     storageBucket: "dam2pay-o.appspot.com",
// //     messagingSenderId: "1010112748895",
// //     appId: "1:1010112748895:web:1c995663d6b03e4acd2aea",
// //     measurementId: "G-H36HTF38QD"
// // };
// // firebase.initializeApp(firebaseConfig);

//  function cargarPlatos(pedidoId) {
//     const db = firebase.firestore(); // Obtiene la referencia a tu Firestore
//     const platosContainer = document.getElementById('platosContainer'); // Contenedor de los platos en tu HTML
  
//     // Acceder a la colección de subpedidos y luego a los platos dentro de cada subpedido
//     db.collection('Pedidos').doc(pedidoId).collection('subPedido')
//       .get()
//       .then(subPedidoSnapshot => {
//         subPedidoSnapshot.forEach(subPedidoDoc => {
//           subPedidoDoc.ref.collection('platosPedido').get().then(platoSnapshot => {
//             platoSnapshot.forEach(platoDoc => {
//               const platoData = platoDoc.data();
//               // Crear el elemento de plato y añadirlo al contenedor
//               const platoElement = document.createElement('div');
//               platoElement.classList.add('form-check', 'mb-2');
  
//               // Aquí asumimos que tienes un campo 'nombrePlato' en la referencia 'idPlato'
//               // Necesitarás obtener ese dato con una llamada adicional a Firestore si no está en el documento del plato
//               platoElement.innerHTML = `
//                 <input class="form-check-input" type="checkbox" value="" id="${platoDoc.id}">
//                 <label class="form-check-label d-block text-break" for="${platoDoc.id}">
//                   ${platoData.idPlato.split('/').pop()} x${platoData.cantidad} <!-- Suponiendo que el último segmento de la referencia es el nombre del plato -->
//                 </label>
//                 <div class="p-1 bg-warning-subtle border border-warning rounded-3 d-inline-block">
//                   ${platoData.comentarios || 'Sin comentarios'}
//                 </div>
//               `;
//               platosContainer.appendChild(platoElement);
//             });
//           });
//         });
//       })
//       .catch(error => {
//         console.error("Error al obtener los documentos: ", error);
//       });
//   }
  
//   // Llamar a la función con el ID del pedido específico
//   cargarPlatos('g5iKP1BLY5RILC5tXYft'); // Sustituir por el ID real del pedido
  