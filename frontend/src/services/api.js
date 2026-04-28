/**
 * ============================================================================
 * MOTOR DE COMUNICACIÓN API (Capa de Servicio)
 * Archivo: frontend/src/js/api.js
 * ============================================================================
 */

const App = {
    // La URL base donde corre tu servidor Node.js (Configurado en server.js)
    BASE_URL: '/api',

    /**
     * Función Maestra para peticiones HTTP (GET, POST, PUT, DELETE)
     * Centraliza el manejo de errores y la conversión a JSON.
     */
    async peticionAPI(endpoint, metodo = 'GET', datos = null) {
        try {
            const opciones = {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Si enviamos datos (POST o PUT), los convertimos a texto JSON
            if (datos) {
                opciones.body = JSON.stringify(datos);
            }

            const respuesta = await fetch(`${this.BASE_URL}${endpoint}`, opciones);
            const resultado = await respuesta.json();

            // Si el servidor responde con un error (400, 404, 500, etc.)
            if (!respuesta.ok) {
                // Usamos nuestra alerta visual para informar al usuario
                this.mostrarAlerta(resultado.error || 'Ocurrió un error inesperado', 'error');
                return null;
            }

            return resultado;

        } catch (error) {
            console.error('Error de conexión:', error);
            this.mostrarAlerta('No se pudo conectar con el servidor. Verifica que Node.js esté encendido.', 'error');
            return null;
        }
    },

    /**
     * Sistema de Notificaciones Visuales (Toast)
     * Crea un pequeño mensaje que desaparece a los 3 segundos.
     */
    mostrarAlerta(mensaje, tipo = 'success') {
        // Creamos el elemento de la alerta
        const alerta = document.createElement('div');
        alerta.className = `alerta-flotante alerta-${tipo}`;
        
        // Icono según el tipo
        const icono = tipo === 'success' ? 'check-circle' : 'exclamation-triangle';
        
        alerta.innerHTML = `
            <i class="fas fa-${icono}"></i>
            <span>${mensaje}</span>
        `;

        // Lo añadimos al cuerpo del documento
        document.body.appendChild(alerta);

        // Animación de salida y eliminación
        setTimeout(() => {
            alerta.style.opacity = '0';
            alerta.style.transform = 'translateY(-20px)';
            setTimeout(() => alerta.remove(), 500);
        }, 3000);
    }
};

// Exportamos para uso global si fuera necesario
window.App = App;