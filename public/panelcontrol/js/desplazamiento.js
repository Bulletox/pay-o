document.addEventListener("DOMContentLoaded", function() {
    // Seleccionamos todas las columnas
    const columns = document.querySelectorAll('.col');

    // Cantidad de columnas visibles en un momento dado
    const visibleColumns = 3;

    // Índice del primer grupo de columnas visible
    let startIndex = 0;

    // Ocultamos todas las columnas
    columns.forEach(col => {
        col.style.display = 'none';
    });

    // Mostramos las primeras 'visibleColumns' columnas
    for (let i = 0; i < visibleColumns; i++) {
        if (columns[i]) {
            columns[i].style.display = 'block';
        }
    }

    // Función para desplazar las columnas hacia la izquierda
    function moveLeft() {
        if (startIndex > 0) {
            columns[startIndex + visibleColumns - 1].style.display = 'none'; // Ocultar última columna del grupo actual
            startIndex--; // Actualizar índice de inicio
            columns[startIndex].style.display = 'block'; // Mostrar nueva columna del grupo
        }
    }

    // Función para desplazar las columnas hacia la derecha
    function moveRight() {
        if (startIndex + visibleColumns < columns.length) {
            columns[startIndex].style.display = 'none'; // Ocultar primera columna del grupo actual
            startIndex++; // Actualizar índice de inicio
            columns[startIndex + visibleColumns - 1].style.display = 'block'; // Mostrar nueva columna del grupo
        }
    }

    // Agregar event listener para la flecha izquierda
    document.getElementById('iconoIzquierda').addEventListener('click', moveLeft);

    // Agregar event listener para la flecha derecha
    document.getElementById('iconoDerecha').addEventListener('click', moveRight);
});
