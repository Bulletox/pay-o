
// Variable global para almacenar la ID de la instancia
let globalIdInstancia = null;

document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    globalIdInstancia = queryParams.get('idInstancia'); // Almacena la ID globalmente

    if (globalIdInstancia) {
        console.log("ID de la Instancia:", globalIdInstancia);
    } else {
        console.log("No se encontró ID de instancia en la URL.");
    }
});


function visuaComida() {
    if (globalIdInstancia) {
        location.href = `visuaComida.html?id=${globalIdInstancia}`;
    } else {
        console.log("Error: No hay ID de instancia disponible.");
    }
}

function verCarro() {
    if (globalIdInstancia) {
        location.href = `carrito.html?id=${globalIdInstancia}`;
    } else {
        console.log("Error: No hay ID de instancia disponible.");
    }
}

function goBack() {
    window.history.go(-1);
}
