/**
 * ============================================================================
 * CONTROLADOR: RECURSOS OPERATIVOS (Agentes y Transportes)
 * Archivo: backend/controllers/recurso.controller.js
 * ============================================================================
 */

const pool = require('../config/db_pedro');

const RecursoController = {

    /* ========================================================================
       SECCIÓN 1: GESTIÓN DE TIPO DE AGENTE (Tabla: tipo_agente)
       ======================================================================== */

    obtenerTiposAgente: async (req, res) => {
        try {
            const [filas] = await pool.query('SELECT * FROM tipo_agente ORDER BY ID_TA DESC');
            res.json(filas);
        } catch (error) {
            console.error('Error al obtener tipos de agente:', error);
            res.status(500).json({ error: 'Error al consultar tipos de agente.' });
        }
    },

    crearTipoAgente: async (req, res) => {
        try {
            // Nota de Arquitectura: 
            // Tu tabla original ('tipo_agente') en 'db_darwin' NO tiene AUTO_INCREMENT en ID_TA.
            // Si no lo modificaste en la base de datos, tendríamos que generar el ID manualmente.
            // Asumiremos que es autoincrementable o que permites valores nulos para un auto-generado,
            // pero lo más seguro es enviar solo el nombre si la BD lo permite.
            
            const { NOMBRE_TA } = req.body;

            if (!NOMBRE_TA) {
                return res.status(400).json({ error: 'El nombre del tipo de agente es obligatorio.' });
            }

            // OJO: Si ID_TA requiere un número manual porque no es AUTO_INCREMENT, 
            // tendríamos que hacer: SELECT MAX(ID_TA) + 1 FROM tipo_agente...
            const [resultado] = await pool.query(
                'INSERT INTO tipo_agente (NOMBRE_TA) VALUES (?)', 
                [NOMBRE_TA]
            );
            
            res.status(201).json({ mensaje: 'Tipo de Agente registrado', id: resultado.insertId });
        } catch (error) {
            console.error('Error al crear tipo de agente:', error);
            res.status(500).json({ error: 'Error interno al guardar el tipo de agente.' });
        }
    },

    actualizarTipoAgente: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_TA } = req.body;

            if (!NOMBRE_TA) return res.status(400).json({ error: 'El nombre es requerido.' });

            const [resultado] = await pool.query(
                'UPDATE tipo_agente SET NOMBRE_TA = ? WHERE ID_TA = ?', 
                [NOMBRE_TA, id]
            );

            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Agente no encontrado.' });

            res.json({ mensaje: 'Tipo de Agente actualizado correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar tipo de agente.' });
        }
    },

    eliminarTipoAgente: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM tipo_agente WHERE ID_TA = ?', [id]);
            
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'El tipo de agente no existe.' });
            
            res.json({ mensaje: 'Tipo de Agente eliminado.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ 
                    error: 'No se puede eliminar porque este Agente está asignado a un Registro o Actividad.' 
                });
            }
            res.status(500).json({ error: 'Error al intentar eliminar el tipo de agente.' });
        }
    },

    /* ========================================================================
       SECCIÓN 2: GESTIÓN DE TIPO DE TRANSPORTE (Tabla: tipo_transporte)
       ======================================================================== */

    obtenerTransportes: async (req, res) => {
        try {
            const [filas] = await pool.query('SELECT * FROM tipo_transporte ORDER BY id_tt DESC');
            res.json(filas);
        } catch (error) {
            console.error('Error al obtener transportes:', error);
            res.status(500).json({ error: 'Error al consultar tipos de transporte.' });
        }
    },

    crearTransporte: async (req, res) => {
        try {
            const { NOMBRE_TRANSPORTE } = req.body;

            if (!NOMBRE_TRANSPORTE) {
                return res.status(400).json({ error: 'El nombre del transporte es obligatorio.' });
            }

            const [resultado] = await pool.query(
                'INSERT INTO tipo_transporte (NOMBRE_TRANSPORTE) VALUES (?)', 
                [NOMBRE_TRANSPORTE]
            );
            
            res.status(201).json({ mensaje: 'Transporte registrado', id: resultado.insertId });
        } catch (error) {
            console.error('Error al crear transporte:', error);
            res.status(500).json({ error: 'Error interno al guardar el transporte.' });
        }
    },

    actualizarTransporte: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_TRANSPORTE } = req.body;

            if (!NOMBRE_TRANSPORTE) return res.status(400).json({ error: 'El nombre es requerido.' });

            const [resultado] = await pool.query(
                'UPDATE tipo_transporte SET NOMBRE_TRANSPORTE = ? WHERE id_tt = ?', 
                [NOMBRE_TRANSPORTE, id]
            );

            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Transporte no encontrado.' });

            res.json({ mensaje: 'Transporte actualizado correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar transporte.' });
        }
    },

    eliminarTransporte: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM tipo_transporte WHERE id_tt = ?', [id]);
            
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'El transporte no existe.' });
            
            res.json({ mensaje: 'Transporte eliminado.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ 
                    error: 'No se puede eliminar porque este Transporte está siendo usado en un Registro.' 
                });
            }
            res.status(500).json({ error: 'Error al intentar eliminar el transporte.' });
        }
    }
};

module.exports = RecursoController;