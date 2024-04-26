document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const idInstancia = queryParams.get('id'); // Obtén la ID de la instancia desde la URL

    if (idInstancia) {
        console.log("ID de la Instancia:", idInstancia);
        // Puedes usar idInstancia para cargar datos específicos de esa instancia
    } else {
        console.log("No se encontró ID de instancia en la URL.");
    }
});
