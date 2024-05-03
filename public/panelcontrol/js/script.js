// function toggleSidebar() {
//     var sidebar = document.getElementById('egg-fried-sidebar');
//     sidebar.classList.toggle('show');
// }

// function toggleSidebarhide() {
//     var sidebar = document.getElementById('egg-fried-sidebar');
//     sidebar.classList.toggle('hide');
let sideBar = true;
let emergente = false;

function toggleSidebar() {
    var sidebar = document.getElementById('egg-fried-sidebar');
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    } else {
        sidebar.classList.add('show');
    }
}

function toggleSidebarLeft() {
    if (sideBar === true) {
        document.querySelector('.main').style.marginLeft = "0vw"
        document.querySelector('footer').style.marginLeft = "0vw"
        sideBar = false
    } else {
        document.querySelector('.main').style.marginLeft = "15vw"
        document.querySelector('footer').style.marginLeft = "15vw"
        sideBar = true
    }
}

function irCocina() {
    location.href = "/panelcontrol/cocina.html"
}

function irCarta() {
    location.href = "/panelcontrol/gestionCarta.html"
}

function irVisuaCarta() {
    location.href = "/panelcontrol/visuaCarta.html"
}

function irPedidos() {
    location.href = "/panelcontrol/index.html"
}

function irAyuda() {
    location.href = "/panelcontrol/help.html"
}

function irmesas() {
    location.href = "/panelcontrol/gestionmesas.html"
}
// Imagen

function handleClick() {
    document.getElementById('file_input').click();
}

function dragOverHandler(event) {
    event.preventDefault();
    document.getElementById('drop_zone').classList.add('hover');
}

function dropHandler(event) {
    event.preventDefault();
    document.getElementById('drop_zone').classList.remove('hover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleFiles(files);
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    handleFiles([file]);
}

function goBack() {
    window.history.back();
}


function handleFiles(files) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgElement = document.createElement('img');
            imgElement.src = event.target.result;
            imgElement.onclick = handleClick;
            document.getElementById('drop_zone').innerHTML = '';
            document.getElementById('drop_zone').appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Por favor selecciona un archivo de imagen válido.');
    }
}

function texto(e) {
    document.getElementById("inputComida").placeholder = e.innerText
}

function texto2(e) {
    document.getElementById("cantidad").placeholder = e.innerText
}

let alergenosArray = [];

function texto3(e) {
    const texto = e.innerText.trim();
    const index = alergenosArray.indexOf(texto);
    if (index === -1) {
        alergenosArray.push(texto);
    } else {
        alergenosArray.splice(index, 1);
    }
    updatePlaceholder();
}

function updatePlaceholder() {
    const alergenosInput = document.getElementById("alergenos");
    alergenosInput.value = alergenosArray.join(", ");
}

function emergenteInfo() {
    if (emergente) {
        document.querySelector('.caja').style.display = "none"
        document.querySelector('.capaNegra').style.display = "none"

        emergente = false
    } else {
        document.querySelector('.caja').style.display = "flex"
        document.querySelector('.capaNegra').style.display = "flex"
        emergente = true
    }
}

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