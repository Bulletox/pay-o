let sideBar = true;
let emergente = false;
let emergente2 = false;

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

function irIndex() {
    location.href = "/panelcontrol/index.html"
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

function emergenteInfo2() {
    let qrCodeImg = document.querySelector('#qr-code img').src;

    if (emergente2) {
        document.querySelector('.caja').style.display = "none"
        document.querySelector('.capaNegra').style.display = "none"
        document.querySelector('#imagenQR').style.display = "none"
        emergente2 = false
    } else {
        document.querySelector('.caja').style.display = "flex"
        document.querySelector('.capaNegra').style.display = "flex"
        emergente2 = true
        document.querySelector('#imagenQR').src = qrCodeImg
        document.querySelector('#imagenQR').style.display = "flex"
    }
}