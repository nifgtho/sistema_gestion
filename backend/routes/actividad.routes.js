const express = require('express');
const router = express.Router();
const ActividadController = require('../controllers/actividad.controller');

router.get('/', ActividadController.obtenerTodos);
router.post('/', ActividadController.crear);
router.put('/:id', ActividadController.actualizar);
router.delete('/:id', ActividadController.eliminar);

module.exports = router;