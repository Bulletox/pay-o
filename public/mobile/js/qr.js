document.addEventListener('DOMContentLoaded', function() {
    actualizarURLConPedido(); // Llamar a la función al cargar la página
});

function actualizarURLConPedido() {
    const queryParams = new URLSearchParams(window.location.search);
    const idInstancia = queryParams.get('iId');
    const idPedido = queryParams.get('pId');
    const urlBase = "http://dam2pay-o.web.app/mobile/menu.html";
    const urlCompleta = `${urlBase}?iId=${idInstancia}&pId=${idPedido}`;
    console.log("URL Completa:", urlCompleta);
    generarQR(urlCompleta);
}

function generarQR(urlCompleta) {
    console.log("Generando QR para la URL: ", urlCompleta);
    let tipo = 10;
    let errorCorrectionLevel = 'L';
    let qr = qrcode(tipo, errorCorrectionLevel);
    qr.addData(urlCompleta);
    qr.make();
    let qrCodeDiv = document.getElementById('qr-code');
    if (qrCodeDiv) {
        qrCodeDiv.innerHTML = qr.createImgTag(4);
    } else {
        console.error('El elemento para mostrar el QR no está disponible en el DOM');
    }
    console.log("QR generado correctamente");
}