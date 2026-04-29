const pool = require('../config/db_pedro');

const AccionEspecController = {
    obtenerTodos: async (req, res) => {
        try {
            const [filas] = await pool.query('SELECT * FROM accion_especifica ORDER BY ID_AE DESC');
            res.json(filas);
        } catch (error) {
            console.error('Error al obtener acciones específicas:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
    },

    crear: async (req, res) => {
        try {
            const { NOMBRE_ABREVIADO, ACCION_ESPECIFICA, CODIGO_A_E } = req.body;

            if (!NOMBRE_ABREVIADO || !ACCION_ESPECIFICA || !CODIGO_A_E) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }

            const sql = 'INSERT INTO accion_especifica (NOMBRE_ABREVIADO, ACCION_ESPECIFICA, CODIGO_A_E) VALUES (?, ?, ?)';
            const [resultado] = await pool.query(sql, [NOMBRE_ABREVIADO, ACCION_ESPECIFICA, CODIGO_A_E]);
            
            res.status(201).json({ mensaje: 'Acción Específica registrada', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error interno al guardar los datos.' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_ABREVIADO, ACCION_ESPECIFICA, CODIGO_A_E } = req.body;

            if (!NOMBRE_ABREVIADO || !ACCION_ESPECIFICA || !CODIGO_A_E) {
                return res.status(400).json({ error: 'Faltan datos obligatorios.' });
            }

            const sql = 'UPDATE accion_especifica SET NOMBRE_ABREVIADO = ?, ACCION_ESPECIFICA = ?, CODIGO_A_E = ? WHERE ID_AE = ?';
            const [resultado] = await pool.query(sql, [NOMBRE_ABREVIADO, ACCION_ESPECIFICA, CODIGO_A_E, id]);

            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado.' });
            res.json({ mensaje: 'Actualizado correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar.' });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM accion_especifica WHERE ID_AE = ?', [id]);
            
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'El registro no existe.' });
            res.json({ mensaje: 'Eliminado con éxito.' });
        } catch (error) {
            // Protección por si está amarrada a un "detalle_registro" o "subaccion"
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: 'No se puede eliminar porque está siendo usada en una Subacción o Registro.' });
            }
            res.status(500).json({ error: 'Error al eliminar.' });
        }
    }
};

module.exports = AccionEspecController;