const rutasVistas = {
    'dashboard': '/src/views/dashboard/inicio.html',
    'accion': '/src/views/catalogos_operativos/Accion.html',
    'detalle_registro': '/src/views/modulo_principal/DetalleRegistro.html'
};

async function cargarVista(vistaID) {
    const contentArea = document.getElementById('content-area');
    const viewTitle = document.getElementById('view-title');
    
    // 1. Mostrar cargando
    contentArea.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Cargando módulo...</p></div>';

    const url = rutasVistas[vistaID];
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Archivo no encontrado");
        
        const html = await response.text();
        contentArea.innerHTML = html;

        // 2. Actualizar título de la cabecera
        if(viewTitle) viewTitle.innerText = vistaID.toUpperCase().replace('_', ' ');

        // 3. ¡ESTO ES LO QUE TE FALTA! Ejecutar el script que viene dentro del HTML
        // Buscamos si el HTML inyectado tiene un inicializarModulo
        setTimeout(() => {
            if (typeof inicializarModulo === 'function') {
                inicializarModulo(vistaID);
            }
        }, 100);

    } catch (error) {
        contentArea.innerHTML = `<div class="alert-error">❌ Error: No se pudo cargar el archivo en ${url}</div>`;
        console.error(error);
    }
}