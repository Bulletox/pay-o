const instanciaManager = {
    globalIdInstancia: null,
    globalIdpedido: null,
    init: function () {
        document.addEventListener('DOMContentLoaded', () => {
            this.handleLoad();
            this.setupEventListeners();
        });
    },

    handleLoad: function () {
        const queryParams = new URLSearchParams(window.location.search);
        this.globalIdInstancia = queryParams.get('iId');
        this.globalIdpedido = queryParams.get('pId');
        if (this.globalIdInstancia && this.globalIdpedido) { // Verifica ambos IDs
            console.log("ID de la Instancia:", this.globalIdInstancia);
            console.log("ID del Pedido:", this.globalIdpedido);
        } else {
            console.error("No se encontraron los IDs necesarios en la URL.");
        }
    },

    setupEventListeners: function () {
        document.getElementById('modifyItemsBtn').addEventListener('click', () => this.navigate('carrito.html'));
        document.getElementById('historialItemsBtn').addEventListener('click', () => this.navigate('historial.html'));
        document.getElementById('addItemsBtn').addEventListener('click', () => this.navigate('comida.html'));
        document.getElementById('payBtn').addEventListener('click', () => this.navigate('cuentaTotal.html'));
        document.getElementById('contenedorPadre').addEventListener('click', () => this.navigate('visua.html'));
        document.getElementById('irMenu').addEventListener('click', () => this.navigate('menu.html'));
        document.getElementById('irPagar').addEventListener('click', () => this.navigate('Pagar.html'));
    },

    navigate: function (page) {
        if (this.globalIdInstancia && this.globalIdpedido) {
            location.href = `/mobile/${page}?iId=${this.globalIdInstancia}&pId=${this.globalIdpedido}`;
        } else {
            console.error("Error: No hay IDs de instancia o pedido disponibles.");
        }
    }
};

instanciaManager.init();

function goBack() {
    window.history.back();
}
