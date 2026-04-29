const express = require('express');
const router = express.Router();
const AccionController = require('../controllers/accion.controller');

// GET: http://localhost:3000/api/accion (Para listar en la tabla)
router.get('/', AccionController.obtenerTodos);

// POST: http://localhost:3000/api/accion (Para guardar desde el formulario)
router.post('/', AccionController.crear);

router.put('/:id', AccionController.actualizar); // 🔴 Para editar
router.delete('/:id', AccionController.eliminar); // 🔴 Para borrar

module.exports = router;