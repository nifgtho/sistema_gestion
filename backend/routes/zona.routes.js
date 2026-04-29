const express = require('express');
const router = express.Router();
const ZonaController = require('../controllers/zona.controller');

// RUTAS PARA PROVINCIAS
router.get('/provincia', ZonaController.obtenerProvincias);
router.post('/provincia', ZonaController.crearProvincia);
router.put('/provincia/:id', ZonaController.actualizarProvincia);
router.delete('/provincia/:id', ZonaController.eliminarProvincia);

// RUTAS PARA DISTRITOS
router.get('/distrito', ZonaController.obtenerDistritos);
router.post('/distrito', ZonaController.crearDistrito);
router.put('/distrito/:id', ZonaController.actualizarDistrito);
router.delete('/distrito/:id', ZonaController.eliminarDistrito);

module.exports = router;