const pool = require('../config/db_pedro');

const ActividadController = {
    obtenerTodos: async (req, res) => {
        try {
            const sql = `
                SELECT a.*, ta.NOMBRE_TA 
                FROM actividad a
                LEFT JOIN tipo_agente ta ON a.ID_TA = ta.ID_TA
                ORDER BY a.ID_ACTIVIDAD DESC
            `;
            const [filas] = await pool.query(sql);
            res.json(filas);
        } catch (error) {
            console.error('Error en actividades:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
    },

    crear: async (req, res) => {
        try {
            const { NOMBRE_ACTIVIDAD, CODIGO_ACTIVIDAD, ID_TA } = req.body;

            if (!NOMBRE_ACTIVIDAD || !CODIGO_ACTIVIDAD) {
                return res.status(400).json({ error: 'El nombre y el código son obligatorios.' });
            }

            const sql = 'INSERT INTO actividad (NOMBRE_ACTIVIDAD, CODIGO_ACTIVIDAD, ID_TA) VALUES (?, ?, ?)';
            const valores = [NOMBRE_ACTIVIDAD, CODIGO_ACTIVIDAD, ID_TA || null];
            
            const [resultado] = await pool.query(sql, valores);
            res.status(201).json({ mensaje: 'Actividad registrada con éxito', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error interno al guardar los datos.' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_ACTIVIDAD, CODIGO_ACTIVIDAD, ID_TA } = req.body;

            const sql = 'UPDATE actividad SET NOMBRE_ACTIVIDAD = ?, CODIGO_ACTIVIDAD = ?, ID_TA = ? WHERE ID_ACTIVIDAD = ?';
            const valores = [NOMBRE_ACTIVIDAD, CODIGO_ACTIVIDAD, ID_TA || null, id];

            const [resultado] = await pool.query(sql, valores);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado.' });
            
            res.json({ mensaje: 'Actualizado correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar.' });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM actividad WHERE ID_ACTIVIDAD = ?', [id]);
            
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'El registro no existe.' });
            res.json({ mensaje: 'Eliminado con éxito.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: 'No se puede eliminar: está siendo usada en un Registro de Supervisión.' });
            }
            res.status(500).json({ error: 'Error al eliminar.' });
        }
    }
};

module.exports = ActividadController;