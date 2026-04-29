const express = require('express');
const router = express.Router();
const SubaccionController = require('../controllers/subaccion.controller');

router.get('/', SubaccionController.obtenerTodos);
router.post('/', SubaccionController.crear);
router.put('/:id', SubaccionController.actualizar);
router.delete('/:id', SubaccionController.eliminar);

module.exports = router;