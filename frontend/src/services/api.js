/**
 * ============================================================================
 * MOTOR DE COMUNICACIÓN CON EL BACKEND
 * Archivo: frontend/src/services/api.js
 * ============================================================================
 */

const App = {
    /**
     * Función central para hablar con Node.js
     * @param {string} endpoint - La ruta (ej. Endpoints.ACCION)
     * @param {string} metodo - 'GET', 'POST', 'PUT', 'DELETE'
     * @param {object} datos - Los datos del formulario a guardar
     */
    async peticionAPI(endpoint, metodo = 'GET', datos = null) {
        try {
            const opciones = {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (datos) {
                opciones.body = JSON.stringify(datos);
            }

            const respuesta = await fetch(endpoint, opciones);
            
            // --- EL ESCUDO: Verificamos si la respuesta es realmente JSON ---
            const esJson = respuesta.headers.get("content-type")?.includes("application/json");

            if (!esJson) {
                console.warn(`⚠️ Aviso: La ruta ${endpoint} no devolvió datos (Probablemente la ruta aún no está creada en Node.js)`);
                return null; // Retornamos null en silencio para no romper la pantalla
            }

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                this.mostrarAlerta(resultado.error || 'Ocurrió un error en el servidor.', 'error');
                return null;
            }

            return resultado;

        } catch (error) {
            console.error('❌ Error de conexión:', error);
            this.mostrarAlerta('No se pudo conectar con el servidor local.', 'error');
            return null;
        }
    },
    mostrarAlerta(mensaje, tipo = 'success') {
        const alerta = document.createElement('div');
        const colorFondo = tipo === 'success' ? '#28a745' : '#dc3545';
        const icono = tipo === 'success' ? 'check-circle' : 'exclamation-triangle';
        
        // Estilos en línea para asegurar que siempre se vea bien sin depender de CSS externo
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${colorFondo};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            transition: all 0.5s ease-in-out;
            transform: translateY(-20px);
            opacity: 0;
        `;
        
        alerta.innerHTML = `<i class="fas fa-${icono} fa-lg"></i> <span>${mensaje}</span>`;
        document.body.appendChild(alerta);

        // Animación de entrada
        setTimeout(() => {
            alerta.style.transform = 'translateY(0)';
            alerta.style.opacity = '1';
        }, 10);

        // Autodestrucción después de 3 segundos
        setTimeout(() => {
            alerta.style.opacity = '0';
            alerta.style.transform = 'translateY(-20px)';
            setTimeout(() => alerta.remove(), 500);
        }, 3000);
    }
};

// Exponemos App globalmente para usarlo en las vistas HTML
window.App = App;