
document.addEventListener('DOMContentLoaded', async () => {
    const platosContainer = document.getElementById('platosContainer');
    const bebidasContainer = document.getElementById('bebidasContainer'); // Asegúrate de que este elemento existe en tu HTML

    
    
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

        let htmlContentcomida = ''; 
        let htmlContentbebida = '';

        subPedidoSnapshot.forEach((doc) => {
            const subPedido = doc.data();

            // Verificar que el subpedido tenga estadoSubPedido igual a 0
            if (subPedido.estadoSubPedido === 0) {
                const plato = subPedido.plato;
                const platoId = subPedido.platoId;
                //const platoLink = `visuaComida.html?iId=${instanciaId}&pId=${pedidoId}&plId=${platoId}`;

                const itemHtml = `
                <div class="itemComida d-flex justify-content-between pb-1 border-bottom mb-4 cursor-pointer">
                    <div class="descript d-flex flex-column">
                        <strong class="fs-3">${plato.nombrePlato}</strong>
                        <p><strong>${plato.precio}€</strong></p>
                        <div class="short">
                            <p class="ellipsis">${plato.descripcion || ''}</p>
                        </div>
                    </div>
                    <div class="" style="height: 100%;">
                        <img src="${plato.imagenUrl || 'img/paella.png'}" alt="" height="125" width="125">
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-center ms-3">
                        <i class="fs-2 bi bi-dash-circle cursor-pointer"></i>
                        <p><strong>1</strong></p>
                        <i class="fs-2 bi bi-plus-circle cursor-pointer"></i>
                    </div>
                </div>
                `;

                if (plato.categoria == 0) {
                    htmlContentcomida += itemHtml;
                } else {
                    htmlContentbebida += itemHtml;
                }
            }
        });

        platosContainer.innerHTML = htmlContentcomida;
        bebidasContainer.innerHTML = htmlContentbebida;
    } catch (error) {
        console.error(error);
    }
});
