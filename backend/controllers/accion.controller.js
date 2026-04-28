/**
 * ============================================================================
 * CONTROLADOR: CATÁLOGO DE ACCIONES
 * Archivo: backend/controllers/accion.controller.js
 * ============================================================================
 */

const pool = require('../config/db_pedro');

const AccionController = {
    
    /**
     * 1. OBTENER TODAS LAS ACCIONES (Read)
     * Sirve para llenar la tabla principal de la vista Accion.html
     */
    obtenerAcciones: async (req, res) => {
        try {
            // Obtenemos los registros ordenados del más nuevo al más antiguo
            const [filas] = await pool.query('SELECT * FROM accion ORDER BY ID_ACCION DESC');
            res.json(filas);
        } catch (error) {
            console.error('Error al obtener acciones:', error);
            res.status(500).json({ error: 'Error interno del servidor al consultar las acciones.' });
        }
    },

    /**
     * 2. OBTENER UNA ACCIÓN POR ID
     * Útil si en el futuro necesitas buscar los datos de un solo registro específico.
     */
    obtenerAccionPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [filas] = await pool.query('SELECT * FROM accion WHERE ID_ACCION = ?', [id]);
            
            if (filas.length === 0) {
                return res.status(404).json({ error: 'La acción solicitada no existe.' });
            }
            res.json(filas[0]);
        } catch (error) {
            console.error('Error al obtener acción:', error);
            res.status(500).json({ error: 'Error interno al consultar la base de datos.' });
        }
    },

    /**
     * 3. CREAR UNA NUEVA ACCIÓN (Create)
     * Recibe los datos del formulario y los inserta en la base de datos.
     */
    crearAccion: async (req, res) => {
        try {
            const { NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION } = req.body;

            // Validación de seguridad en el backend (doble escudo protector)
            if (!NOMBRE_ABREVIADO || !NOMBRE_ACCION) {
                return res.status(400).json({ error: 'Los campos Nombre Abreviado y Nombre Acción son obligatorios.' });
            }

            const sql = 'INSERT INTO accion (NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION) VALUES (?, ?, ?, ?)';
            const valores = [NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E || null, CODIGO_P_ACCION || null];

            const [resultado] = await pool.query(sql, valores);
            
            res.status(201).json({ 
                mensaje: 'Acción registrada con éxito', 
                id: resultado.insertId 
            });
        } catch (error) {
            console.error('Error al crear acción:', error);
            res.status(500).json({ error: 'No se pudo guardar la acción: ' + error.message });
        }
    },

    /**
     * 4. ACTUALIZAR UNA ACCIÓN EXISTENTE (Update)
     * Cuando le das clic en "Editar" en la tabla y luego en "Guardar".
     */
    actualizarAccion: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION } = req.body;

            if (!NOMBRE_ABREVIADO || !NOMBRE_ACCION) {
                return res.status(400).json({ error: 'Faltan campos obligatorios para actualizar.' });
            }

            const sql = 'UPDATE accion SET NOMBRE_ABREVIADO = ?, NOMBRE_ACCION = ?, CODIGO_A_E = ?, CODIGO_P_ACCION = ? WHERE ID_ACCION = ?';
            const valores = [NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E || null, CODIGO_P_ACCION || null, id];

            const [resultado] = await pool.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'No se encontró la acción a actualizar.' });
            }

            res.json({ mensaje: 'Acción actualizada correctamente.' });
        } catch (error) {
            console.error('Error al actualizar acción:', error);
            res.status(500).json({ error: 'Error interno al actualizar la acción.' });
        }
    },

    /**
     * 5. ELIMINAR UNA ACCIÓN (Delete)
     * Borrado seguro. Si la acción ya se usó en un Detalle_Registro, el backend detiene el borrado.
     */
    eliminarAccion: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM accion WHERE ID_ACCION = ?', [id]);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'La acción no existe o ya fue eliminada.' });
            }
            
            res.json({ mensaje: 'Acción eliminada del sistema.' });
        } catch (error) {
            // Manejo profesional de Llaves Foráneas (Foreign Key Constraint)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ 
                    error: 'No se puede eliminar esta acción porque ya está siendo utilizada en un Registro de Supervisión.' 
                });
            }
            console.error('Error al eliminar:', error);
            res.status(500).json({ error: 'Ocurrió un error al intentar eliminar el registro.' });
        }
    }
};

module.exports = AccionController;