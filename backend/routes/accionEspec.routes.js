const express = require('express');
const router = express.Router();
const AccionEspecController = require('../controllers/accionEspec.controller');

router.get('/', AccionEspecController.obtenerTodos);
router.post('/', AccionEspecController.crear);
router.put('/:id', AccionEspecController.actualizar);
router.delete('/:id', AccionEspecController.eliminar);

module.exports = router;