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
        // Helper function to safely add event listeners
        const safeAddEventListener = (selector, event, handler) => {
            const element = document.getElementById(selector);
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.log(`Elemento no encontrado: ${selector}`);
            }
        };
    
        // Añadir listeners usando la función de ayuda
        safeAddEventListener('qr', 'click', () => this.navigate('index.html'));
        safeAddEventListener('modifyItemsBtn', 'click', () => this.navigate('carrito.html'));
        safeAddEventListener('historialItemsBtn', 'click', () => this.navigate('historial.html'));
        safeAddEventListener('addItemsBtn', 'click', () => this.navigate('comida.html'));
        safeAddEventListener('payBtn', 'click', () => this.navigate('cuentaTotal.html'));
        safeAddEventListener('contenedorPadre', 'click', () => this.navigate('visua.html'));
        safeAddEventListener('irMenu', 'click', () => this.navigate('menu.html'));
        safeAddEventListener('irPagar', 'click', () => this.navigate('Pagar.html'));
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
