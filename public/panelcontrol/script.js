// function toggleSidebar() {
//     var sidebar = document.getElementById('egg-fried-sidebar');
//     sidebar.classList.toggle('show');
// }

// function toggleSidebarhide() {
//     var sidebar = document.getElementById('egg-fried-sidebar');
//     sidebar.classList.toggle('hide');
let sideBar = true;

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
        sideBar = false
    } else {
        document.querySelector('.main').style.marginLeft = "15vw"
        sideBar = true
    }
}

function alerta() {
    alert("asd")
}

function irCocina() {
    location.href = "/panelcontrol/cocina.html"
}

function irCarta() {
    location.href = "/panelcontrol/gestionCarta.html"
}

function irPedidos() {
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
