const pool = require('../config/db_pedro');

const SubaccionController = {
    obtenerTodos: async (req, res) => {
        try {
            const sql = `
                SELECT sa.*, ae.ACCION_ESPECIFICA AS NOMBRE_AE 
                FROM subaccion sa
                LEFT JOIN accion_especifica ae ON sa.ID_AE = ae.ID_AE
                ORDER BY sa.ID_SA DESC
            `;
            const [filas] = await pool.query(sql);
            res.json(filas);
        } catch (error) {
            console.error('Error en subacciones:', error);
            res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
    },

    crear: async (req, res) => {
        try {
            const { NOMBRE_ABREVIADO, SUB_ACCION_ESP, CONCAT, CODIGO_S_A_E, ID_AE } = req.body;

            if (!NOMBRE_ABREVIADO || !SUB_ACCION_ESP || !CONCAT || !CODIGO_S_A_E || !ID_AE) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }

            const sql = 'INSERT INTO subaccion (NOMBRE_ABREVIADO, SUB_ACCION_ESP, CONCAT, CODIGO_S_A_E, ID_AE) VALUES (?, ?, ?, ?, ?)';
            const valores = [NOMBRE_ABREVIADO, SUB_ACCION_ESP, CONCAT, CODIGO_S_A_E, ID_AE];
            
            const [resultado] = await pool.query(sql, valores);
            res.status(201).json({ mensaje: 'Subacción registrada con éxito', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error interno al guardar los datos.' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_ABREVIADO, SUB_ACCION_ESP, CONCAT, CODIGO_S_A_E, ID_AE } = req.body;

            const sql = 'UPDATE subaccion SET NOMBRE_ABREVIADO = ?, SUB_ACCION_ESP = ?, CONCAT = ?, CODIGO_S_A_E = ?, ID_AE = ? WHERE ID_SA = ?';
            const valores = [NOMBRE_ABREVIADO, SUB_ACCION_ESP, CONCAT, CODIGO_S_A_E, ID_AE, id];

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
            const [resultado] = await pool.query('DELETE FROM subaccion WHERE ID_SA = ?', [id]);
            
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

module.exports = SubaccionController;