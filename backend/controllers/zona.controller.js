/**
 * ============================================================================
 * CONTROLADOR: ZONAS GEOGRÁFICAS (Provincias y Distritos)
 * Archivo: backend/controllers/zona.controller.js
 * ============================================================================
 */
const pool = require('../config/db_pedro');

const ZonaController = {
    
    /* --- SECCIÓN 1: PROVINCIAS --- */

    obtenerProvincias: async (req, res) => {
        try {
            const [filas] = await pool.query('SELECT * FROM zona_provincia ORDER BY id_zp DESC');
            res.json(filas);
        } catch (error) {
            console.error('Error al obtener provincias:', error);
            res.status(500).json({ error: 'Error al consultar provincias.' });
        }
    },

    crearProvincia: async (req, res) => {
        try {
            const { NOMBRE_PROVINCIA } = req.body;
            if (!NOMBRE_PROVINCIA) return res.status(400).json({ error: 'El nombre es obligatorio.' });

            const [resultado] = await pool.query('INSERT INTO zona_provincia (NOMBRE_PROVINCIA) VALUES (?)', [NOMBRE_PROVINCIA]);
            res.status(201).json({ mensaje: 'Provincia registrada', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error interno al guardar la provincia.' });
        }
    },

    actualizarProvincia: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_PROVINCIA } = req.body;
            if (!NOMBRE_PROVINCIA) return res.status(400).json({ error: 'Faltan datos.' });

            const [resultado] = await pool.query('UPDATE zona_provincia SET NOMBRE_PROVINCIA = ? WHERE id_zp = ?', [NOMBRE_PROVINCIA, id]);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'No encontrada.' });
            res.json({ mensaje: 'Provincia actualizada correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar.' });
        }
    },

    eliminarProvincia: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM zona_provincia WHERE id_zp = ?', [id]);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'No existe.' });
            res.json({ mensaje: 'Provincia eliminada.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: 'No se puede eliminar: tiene distritos o registros asociados.' });
            }
            res.status(500).json({ error: 'Error al eliminar.' });
        }
    },

    /* --- SECCIÓN 2: DISTRITOS --- */

    obtenerDistritos: async (req, res) => {
        try {
            const sql = `
                SELECT zd.*, zp.NOMBRE_PROVINCIA 
                FROM zona_distrito zd
                LEFT JOIN zona_provincia zp ON zd.id_zp = zp.id_zp
                ORDER BY zd.id_zd DESC`;
            const [filas] = await pool.query(sql);
            res.json(filas);
        } catch (error) {
            res.status(500).json({ error: 'Error al consultar distritos.' });
        }
    },

    crearDistrito: async (req, res) => {
        try {
            const { NOMBRE_DISTRITO, id_zp } = req.body;
            if (!NOMBRE_DISTRITO || !id_zp) return res.status(400).json({ error: 'Nombre y Provincia obligatorios.' });

            const [resultado] = await pool.query('INSERT INTO zona_distrito (NOMBRE_DISTRITO, id_zp) VALUES (?, ?)', [NOMBRE_DISTRITO, id_zp]);
            res.status(201).json({ mensaje: 'Distrito registrado', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar el distrito.' });
        }
    },

    actualizarDistrito: async (req, res) => {
        try {
            const { id } = req.params;
            const { NOMBRE_DISTRITO, id_zp } = req.body;
            const [resultado] = await pool.query('UPDATE zona_distrito SET NOMBRE_DISTRITO = ?, id_zp = ? WHERE id_zd = ?', [NOMBRE_DISTRITO, id_zp, id]);
            res.json({ mensaje: 'Distrito actualizado.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar.' });
        }
    },

    eliminarDistrito: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM zona_distrito WHERE id_zd = ?', [id]);
            res.json({ mensaje: 'Distrito eliminado.' });
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: 'Distrito en uso en la tabla de registros.' });
            }
            res.status(500).json({ error: 'Error al eliminar.' });
        }
    }
};

module.exports = ZonaController;