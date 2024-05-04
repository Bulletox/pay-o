// Obtener elementos
const videoTitle = document.getElementById('video');

function comprobarTexto() {
    let texto = document.querySelector('#video').textContent
    if (texto === "pedido.") {
        eraseVideo()
    } else {
        eraseVideo2()
    }
}

function eraseVideo() {
    let text = document.querySelector('#video').textContent
    if (text.length > 0) {
        let contenido = text.slice(0, -1); // Elimina el último carácter
        document.querySelector('#video').innerText = contenido
        setTimeout(eraseVideo, 70); // Llama a la función después de 100 milisegundos
    } else {
        revealOediv(); // Cuando el texto 'video' está vacío, muestra 'oediv' gradualmente
    }

}

function eraseVideo2() {
    let text = document.querySelector('#video').textContent
    if (text.length > 0) {
        let contenido = text.slice(0, -1); // Elimina el último carácter
        document.querySelector('#video').innerText = contenido
        setTimeout(eraseVideo2, 70); // Llama a la función después de 100 milisegundos
    } else {
        revealOediv2();
    }

}

// Función para introducir gradualmente el texto 'oediv'
function revealOediv() {

    let text = "pago.";
    let index = 0;

    function addNextLetter() {
        if (index <= text.length) {
            videoTitle.innerText = text.slice(0, index); // Mostrar el texto hasta el índice actual
            index++;
            setTimeout(addNextLetter, 50); // Llama a la función después de 100 milisegundos
        } else {
            setTimeout(comprobarTexto, 1500); // Espera 1 segundo antes de iniciar el borrado
        }
    }

    addNextLetter(); // Comienza a agregar letras
}

function revealOediv2() {
    let text = "pedido.";
    let index = 0;

    function addNextLetter() {
        if (index <= text.length) {
            videoTitle.innerText = text.slice(0, index); // Mostrar el texto hasta el índice actual
            index++;
            setTimeout(addNextLetter, 50); // Llama a la función después de 100 milisegundos
        } else {
            setTimeout(comprobarTexto, 1500); // Espera 1 segundo antes de iniciar el borrado
        }
    }

    addNextLetter(); // Comienza a agregar letras
}

// Función para mostrar un alert después de mostrar 'oediv'

// Llamar a la función para comenzar a borrar el texto
setTimeout(comprobarTexto, 1500); // Espera 1 segundo antes de iniciar el borrado