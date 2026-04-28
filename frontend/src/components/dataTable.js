/**
 * ============================================================================
 * COMPONENTE: GENERADOR DINÁMICO DE TABLAS (DataTables)
 * Archivo: frontend/src/components/dataTable.js
 * ============================================================================
 */

class DataTable {
    /**
     * Construye la configuración de la tabla.
     * @param {Object} config - Configuración (contenedor, datos, columnas, acciones)
     */
    constructor(config) {
        this.containerId = config.containerId; // El ID del <div> donde se pintará la tabla
        this.data = config.data || [];         // Los registros (Array de objetos) que vienen de la BD
        this.columns = config.columns || [];     // La definición de las columnas
        this.actions = config.actions || null;   // Configuración de los botones Editar/Eliminar
    }

    /**
     * Método principal que dibuja la tabla en la pantalla.
     */
    render() {
        const container = document.getElementById(this.containerId);
        
        // Validación de seguridad
        if (!container) {
            console.error(`Error: No se encontró el contenedor id="${this.containerId}"`);
            return;
        }

        // Si la base de datos no devuelve registros (Tabla vacía)
        if (this.data.length === 0) {
            container.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: var(--text-muted); background: var(--bg-main); border-radius: var(--border-radius-md); border: 2px dashed #ced4da;">
                    <i class="fas fa-folder-open fa-3x" style="margin-bottom: 15px; color: #adb5bd;"></i>
                    <h3>Sin registros</h3>
                    <p>No se encontraron datos para mostrar en esta tabla.</p>
                </div>`;
            return;
        }

        // Construir la estructura HTML de la tabla
        let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        ${this.columns.map(col => `<th>${col.label}</th>`).join('')}
                        ${this.actions ? `<th style="width: 120px; text-align: center;">Opciones</th>` : ''}
                    </tr>
                </thead>
                <tbody>
                    ${this.data.map(row => this.buildRow(row)).join('')}
                </tbody>
            </table>
        </div>`;

        // Inyectar el HTML generado en el contenedor
        container.innerHTML = html;

        // Activar los botones de Editar y Eliminar
        this.attachEvents();
    }

    /**
     * Construye una fila (tr) de la tabla basándose en los datos
     */
    buildRow(row) {
        let tr = '<tr>';
        
        // Celdas de datos
        this.columns.forEach(col => {
            // Evitar imprimir "null" o "undefined" si un campo está vacío en la BD
            const cellValue = row[col.key] !== null && row[col.key] !== undefined ? row[col.key] : '<span style="color:#ccc;">--</span>';
            tr += `<td>${cellValue}</td>`;
        });

        // Celda de botones de Acción (Editar / Eliminar)
        if (this.actions) {
            tr += `<td style="text-align: center; display: flex; gap: 5px; justify-content: center;">`;
            const id = row[this.actions.idKey]; // La llave primaria (Ej: ID_ACCION)
            
            if (this.actions.edit) {
                tr += `<button class="btn btn-warning btn-sm btn-edit" data-id="${id}" title="Editar">
                           <i class="fas fa-edit"></i>
                       </button>`;
            }
            if (this.actions.delete) {
                tr += `<button class="btn btn-danger btn-sm btn-delete" data-id="${id}" title="Eliminar">
                           <i class="fas fa-trash"></i>
                       </button>`;
            }
            tr += `</td>`;
        }

        tr += '</tr>';
        return tr;
    }

    /**
     * Escucha los clics en los botones de Editar y Eliminar y ejecuta las funciones
     */
    attachEvents() {
        if (!this.actions) return;

        const container = document.getElementById(this.containerId);
        
        // Eventos para el botón Editar
        if (this.actions.edit) {
            const editBtns = container.querySelectorAll('.btn-edit');
            editBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    // Buscar toda la información de esa fila específica
                    const rowData = this.data.find(r => String(r[this.actions.idKey]) === id);
                    // Enviar los datos a la función que me pasaron
                    this.actions.edit(rowData);
                });
            });
        }

        // Eventos para el botón Eliminar
        if (this.actions.delete) {
            const deleteBtns = container.querySelectorAll('.btn-delete');
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    // Enviar solo el ID a la función de eliminar
                    this.actions.delete(id);
                });
            });
        }
    }
}