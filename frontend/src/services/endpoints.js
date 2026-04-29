/**
 * ============================================================================
 * ENDPOINTS DE LA API (Sincronizados con el Backend)
 * Archivo: frontend/src/services/endpoints.js
 * ============================================================================
 */

const Endpoints = {
    // Módulo Principal (Registro Central)
    REGISTRO: {
        BASE: '/api/detalle_registro',
        DATOS_FORM: '/api/detalle_registro/datos-formulario'
    },

    // Catálogos Operativos
    ACCION: '/api/accion',
    ACCION_ESPECIFICA: '/api/accion_especifica',
    SUBACCION: '/api/subaccion',
    ACTIVIDAD: '/api/actividad',

    // Catálogos de Entorno (Zonas)
    ZONA: {
        PROVINCIA: '/api/zona/provincia',
        DISTRITO: '/api/zona/distrito'
    },

    // Catálogos de Recursos
    RECURSO: {
        AGENTE: '/api/recurso/agente',
        TRANSPORTE: '/api/recurso/transporte'
    }
};

window.Endpoints = Endpoints;