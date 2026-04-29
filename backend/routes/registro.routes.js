/**
 * ============================================================================
 * ENRUTADOR: DETALLE REGISTRO (Módulo Principal)
 * Archivo: backend/routes/registro.routes.js
 * ============================================================================
 */

const express = require('express');
const router = express.Router();

// Importamos el controlador que creamos en el paso anterior
const RegistroController = require('../controllers/registro.controller');

/**
 * RUTAS DE LA API (Endpoints)
 * Aquí definimos qué función del controlador se ejecuta según el tipo de petición (GET, POST, DELETE)
 */

// 1. Obtener todos los datos para llenar los <select> del formulario
// IMPORTANTE: Esta ruta debe ir ANTES de las que tienen "/:id" para que Express no se confunda
router.get('/datos-formulario', RegistroController.obtenerCatalogosFormulario);

// 2. Obtener la lista completa de registros (Para la tabla principal)
router.get('/', RegistroController.obtenerRegistros);

// 3. Crear un nuevo registro maestro de supervisión
router.post('/', RegistroController.crearRegistro);

// 4. Eliminar un registro específico por su ID
router.delete('/:id', RegistroController.eliminarRegistro);

router.put('/:id', RegistroController.actualizarRegistro);
// Nota: Si en el futuro necesitas la opción de "Actualizar" el registro maestro, 
// solo agregarías esto: router.put('/:id', RegistroController.actualizarRegistro);

// Exportamos el enrutador para que el archivo principal (server.js) pueda usarlo
module.exports = router;