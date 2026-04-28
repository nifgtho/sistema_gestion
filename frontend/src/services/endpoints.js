/**
 * ============================================================================
 * REGISTRO DE ENDPOINTS (Rutas de la API)
 * Archivo: frontend/src/js/endpoints.js
 * ============================================================================
 */

const Endpoints = {
    // Módulo Principal (Supervisiones)
    REGISTRO: {
        BASE: '/detalle_registro',
        DATOS_FORM: '/detalle_registro/datos-formulario'
    },

    // Catálogo Operativo
    ACCION: '/accion',
    ACCION_ESPECIFICA: '/accion_especifica',
    SUBACCION: '/subaccion',
    ACTIVIDAD: '/actividad',

    // Catálogo de Entorno (Zonas)
    ZONA: {
        PROVINCIA: '/zona/provincia',
        DISTRITO: '/zona/distrito'
    },

    // Catálogo de Recursos
    RECURSO: {
        AGENTE: '/recurso/agente',
        TRANSPORTE: '/recurso/transporte'
    }
};

// Lo hacemos global para que sea fácil de llamar en los HTML
window.Endpoints = Endpoints;