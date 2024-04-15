const instanciaManager = {
    globalIdInstancia: null,

    init: function () {
        document.addEventListener('DOMContentLoaded', () => {
            this.handleLoad();
            this.setupEventListeners();
        });
    },

    handleLoad: function () {
        const queryParams = new URLSearchParams(window.location.search);
        this.globalIdInstancia = queryParams.get('id');

        if (this.globalIdInstancia) {
            console.log("ID de la Instancia:", this.globalIdInstancia);
        } else {
            console.error("No se encontró ID de instancia en la URL.");
        }
    },

    setupEventListeners: function () {
        document.getElementById('addItemsBtn').addEventListener('click', () => this.navigate('comida.html'));
        document.getElementById('modifyItemsBtn').addEventListener('click', () => this.navigate('carrito.html'));
        document.getElementById('payBtn').addEventListener('click', () => this.navigate('cuentaTotal.html'));
        document.getElementById('contenedorPadre').addEventListener('click', () => this.navigate('visua.html'));
    },

    navigate: function (page) {
        if (this.globalIdInstancia) {
            location.href = `/movile/${page}?id=${this.globalIdInstancia}`;
        } else {
            console.error("Error: No hay ID de instancia disponible.");
        }
    }
};

instanciaManager.init();

function goBack() {
    window.history.back();
}
