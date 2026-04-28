/**
 * ============================================================================
 * ENRUTADOR: RECURSOS OPERATIVOS (Agentes y Transportes)
 * Archivo: backend/routes/recurso.routes.js
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Importamos el controlador maestro de Recursos
const RecursoController = require('../controllers/recurso.controller');

/* ========================================================================
   RUTAS PARA TIPO DE AGENTE (Ej: /api/recurso/agente)
   ======================================================================== */
router.get('/agente', RecursoController.obtenerTiposAgente);
router.post('/agente', RecursoController.crearTipoAgente);
router.put('/agente/:id', RecursoController.actualizarTipoAgente);
router.delete('/agente/:id', RecursoController.eliminarTipoAgente);


/* ========================================================================
   RUTAS PARA TIPO DE TRANSPORTE (Ej: /api/recurso/transporte)
   ======================================================================== */
router.get('/transporte', RecursoController.obtenerTransportes);
router.post('/transporte', RecursoController.crearTransporte);
router.put('/transporte/:id', RecursoController.actualizarTransporte);
router.delete('/transporte/:id', RecursoController.eliminarTransporte);

// Exportamos el enrutador
module.exports = router;