const pool = require('../config/db_pedro');

const AccionController = {
    obtenerTodos: async (req, res) => {
        try {
            const [filas] = await pool.query('SELECT * FROM accion ORDER BY ID_ACCION DESC');
            res.json(filas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener acciones.' });
        }
    },

    crear: async (req, res) => {
        try {
            const { NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION } = req.body;
            const sql = 'INSERT INTO accion (NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION) VALUES (?, ?, ?, ?)';
            const [resultado] = await pool.query(sql, [NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E || null, CODIGO_P_ACCION || null]);
            res.status(201).json({ mensaje: 'Acción registrada con éxito', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar la acción.' });
        }
    },

    // 🔴 NUEVA FUNCIÓN: ACTUALIZAR
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E, CODIGO_P_ACCION } = req.body;
            const sql = 'UPDATE accion SET NOMBRE_ABREVIADO = ?, NOMBRE_ACCION = ?, CODIGO_A_E = ?, CODIGO_P_ACCION = ? WHERE ID_ACCION = ?';
            const [resultado] = await pool.query(sql, [NOMBRE_ABREVIADO, NOMBRE_ACCION, CODIGO_A_E || null, CODIGO_P_ACCION || null, id]);
            
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Acción no encontrada.' });
            res.json({ mensaje: 'Acción actualizada correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar.' });
        }
    },

    // 🔴 NUEVA FUNCIÓN: ELIMINAR
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM accion WHERE ID_ACCION = ?', [id]);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'La acción no existe.' });
            res.json({ mensaje: 'Acción eliminada del catálogo.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: 'No se puede eliminar: esta acción ya está siendo usada en registros maestros.' });
            }
            res.status(500).json({ error: 'Error al eliminar la acción.' });
        }
    }
};

module.exports = AccionController;