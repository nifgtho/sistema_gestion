/**
 * ============================================================================
 * CONTROLADOR DE NAVEGACIÓN Y CARGA DE VISTAS
 * Archivo: frontend/src/components/sidebar.js
 * ============================================================================
 */

// Diccionario de rutas físicas de los archivos HTML
const rutasVistas = {
    // Principal
    'dashboard': '/src/views/dashboard/inicio.html',
    'detalle_registro': '/src/views/modulo_principal/DetalleRegistro.html',
    
    // Operativos
    'accion': '/src/views/catalogos_operativos/Accion.html',
    'accion_especifica': '/src/views/catalogos_operativos/AccionEspec.html',
    'subaccion': '/src/views/catalogos_operativos/Subaccion.html',
    'actividad': '/src/views/catalogos_operativos/Actividad.html',
    
    // Entorno
    'zona_provincia': '/src/views/catalogos_entorno/Provincia.html',
    'zona_distrito': '/src/views/catalogos_entorno/Distrito.html',
    
    // Recursos
    'tipo_agente': '/src/views/catalogos_recursos/TipoAgente.html',
    'tipo_transporte': '/src/views/catalogos_recursos/Transporte.html'
};

// Función principal para cargar la vista en el contenedor central
async function cargarVista(vistaID) {
    const contentArea = document.getElementById('content-area');
    const viewTitle = document.getElementById('view-title');
    
    if (!contentArea) return;

    // 1. Mostrar estado de carga
    contentArea.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin fa-3x" style="color:#0056b3;"></i><p style="margin-top:15px;">Cargando módulo...</p></div>';

    // 2. Buscar la ruta en el diccionario
    const url = rutasVistas[vistaID];
    
    if (!url) {
        contentArea.innerHTML = `<div style="color:red; text-align:center; padding:50px;">❌ Ruta no configurada para: ${vistaID}</div>`;
        return;
    }

    try {
        // 3. Obtener el HTML
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Archivo no encontrado (Error ${response.status})`);

        const html = await response.text();
        contentArea.innerHTML = html;

        // 4. Actualizar visualmente el menú activo
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        const itemClickeado = event ? event.currentTarget : null;
        if (itemClickeado) itemClickeado.classList.add('active');

        // 5. Inyectar y ejecutar los scripts dinámicos (El motor SPA)
        const scripts = contentArea.querySelectorAll('script');
        scripts.forEach(scriptViejo => {
            const scriptNuevo = document.createElement('script');
            if (scriptViejo.src) {
                scriptNuevo.src = scriptViejo.src;
            } else {
                scriptNuevo.innerHTML = scriptViejo.innerHTML;
            }
            document.body.appendChild(scriptNuevo);
            document.body.removeChild(scriptNuevo); // Lo removemos para no ensuciar el DOM
        });

        // 6. Disparar el inicializador del módulo después de inyectar el HTML
        setTimeout(() => {
            if (typeof window.inicializarModulo === 'function') {
                window.inicializarModulo(vistaID);
            }
        }, 150);

    } catch (error) {
        contentArea.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px; text-align: center; margin: 20px;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <h3 style="margin-top: 10px;">Módulo en Construcción</h3>
                <p>El archivo <strong>${url}</strong> aún no existe en tu proyecto.</p>
            </div>`;
        console.error("Error cargando vista:", error);
    }
}