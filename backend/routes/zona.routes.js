/**
 * ============================================================================
 * ENRUTADOR: ZONAS GEOGRÁFICAS (Provincias y Distritos)
 * Archivo: backend/routes/zona.routes.js
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Importamos el controlador maestro de Zonas
const ZonaController = require('../controllers/zona.controller');

/* ========================================================================
   RUTAS PARA PROVINCIAS (Ej: /api/zona/provincia)
   ======================================================================== */
router.get('/provincia', ZonaController.obtenerProvincias);
router.post('/provincia', ZonaController.crearProvincia);
router.put('/provincia/:id', ZonaController.actualizarProvincia);
router.delete('/provincia/:id', ZonaController.eliminarProvincia);


/* ========================================================================
   RUTAS PARA DISTRITOS (Ej: /api/zona/distrito)
   ======================================================================== */
router.get('/distrito', ZonaController.obtenerDistritos);
router.post('/distrito', ZonaController.crearDistrito);
router.put('/distrito/:id', ZonaController.actualizarDistrito);
router.delete('/distrito/:id', ZonaController.eliminarDistrito);

// Exportamos el enrutador
module.exports = router;