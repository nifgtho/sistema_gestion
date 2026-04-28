/**
 * ============================================================================
 * ENRUTADOR: CATÁLOGO DE ACCIONES
 * Archivo: backend/routes/accion.routes.js
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Importamos el controlador de acciones
const AccionController = require('../controllers/accion.controller');

/**
 * RUTAS RESTful API
 * Mapeamos los métodos HTTP (GET, POST, PUT, DELETE) con las funciones del controlador
 */

// 1. OBTENER (Read): Trae todas las acciones para la tabla
router.get('/', AccionController.obtenerAcciones);

// 2. OBTENER POR ID (Read): Trae una sola acción específica
router.get('/:id', AccionController.obtenerAccionPorId);

// 3. CREAR (Create): Guarda una nueva acción desde el formulario
router.post('/', AccionController.crearAccion);

// 4. ACTUALIZAR (Update): Modifica una acción existente al guardar la edición
router.put('/:id', AccionController.actualizarAccion);

// 5. ELIMINAR (Delete): Borra la acción (si no está siendo usada)
router.delete('/:id', AccionController.eliminarAccion);

// Exportamos el enrutador
module.exports = router;