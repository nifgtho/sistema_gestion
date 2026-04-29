const pool = require('../config/db_pedro');

const RegistroController = {
    
    obtenerCatalogosFormulario: async (req, res) => {
        try {
            const [
                [acciones], [accionesEspec], [subacciones], 
                [tiposAgente], [tiposTransporte], [provincias], 
                [distritos], [actividades]
            ] = await Promise.all([
                pool.query('SELECT ID_ACCION, NOMBRE_ACCION FROM accion'),
                pool.query('SELECT ID_AE, ACCION_ESPECIFICA FROM accion_especifica'),
                pool.query('SELECT ID_SA, SUB_ACCION_ESP FROM subaccion'),
                pool.query('SELECT ID_TA, NOMBRE_TA FROM tipo_agente'),
                pool.query('SELECT id_tt, NOMBRE_TRANSPORTE FROM tipo_transporte'),
                pool.query('SELECT id_zp, NOMBRE_PROVINCIA FROM zona_provincia'),
                pool.query('SELECT id_zd, NOMBRE_DISTRITO FROM zona_distrito'),
                pool.query('SELECT ID_ACTIVIDAD, NOMBRE_ACTIVIDAD FROM actividad')
            ]);

            res.json({
                acciones, accionesEspec, subacciones, tiposAgente,
                tiposTransporte, provincias, distritos, actividades
            });
        } catch (error) {
            res.status(500).json({ error: 'Error interno al cargar los datos del formulario.' });
        }
    },

    crearRegistro: async (req, res) => {
        try {
            const data = req.body;
            const sql = `
                INSERT INTO detalle_registro 
                (ID_ACCION, ID_AE, ID_SA, ID_TA, id_tt, id_zd, id_zp, ID_ACTIVIDAD, 
                 NUM_SUPERVISORES, EMPRESA_SUPERVISORA, CALIDAD_ENTREGABLE, NRO_EXPEDIENTE, 
                 CARTA_LINEA, OBSERVACIONES, CONTRATO) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const valores = [
                data.ID_ACCION || null, data.ID_AE || null, data.ID_SA || null, 
                data.ID_TA || null, data.id_tt || null, data.id_zd || null, 
                data.id_zp || null, data.ID_ACTIVIDAD || null,
                data.NUM_SUPERVISORES || null, data.EMPRESA_SUPERVISORA || null, 
                data.CALIDAD_ENTREGABLE || null, data.NRO_EXPEDIENTE || null,
                data.CARTA_LINEA || null, data.OBSERVACIONES || null, data.CONTRATO || null
            ];

            const [resultado] = await pool.query(sql, valores);
            res.status(201).json({ mensaje: 'Registro de supervisión guardado exitosamente', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: 'No se pudo guardar: ' + error.message });
        }
    },

    // 🔴 NUEVA FUNCIÓN: ACTUALIZAR REGISTRO
    actualizarRegistro: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const sql = `
                UPDATE detalle_registro SET 
                ID_ACCION=?, ID_AE=?, ID_SA=?, ID_TA=?, id_tt=?, id_zd=?, id_zp=?, ID_ACTIVIDAD=?, 
                NUM_SUPERVISORES=?, EMPRESA_SUPERVISORA=?, CALIDAD_ENTREGABLE=?, NRO_EXPEDIENTE=?, 
                CARTA_LINEA=?, OBSERVACIONES=?, CONTRATO=? 
                WHERE ID_REGISTRO = ?
            `;
            const valores = [
                data.ID_ACCION || null, data.ID_AE || null, data.ID_SA || null, 
                data.ID_TA || null, data.id_tt || null, data.id_zd || null, 
                data.id_zp || null, data.ID_ACTIVIDAD || null,
                data.NUM_SUPERVISORES || null, data.EMPRESA_SUPERVISORA || null, 
                data.CALIDAD_ENTREGABLE || null, data.NRO_EXPEDIENTE || null,
                data.CARTA_LINEA || null, data.OBSERVACIONES || null, data.CONTRATO || null,
                id
            ];

            const [resultado] = await pool.query(sql, valores);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado.' });
            
            res.json({ mensaje: 'Registro maestro actualizado correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'No se pudo actualizar: ' + error.message });
        }
    },

    obtenerRegistros: async (req, res) => {
        try {
            // 🔴 CAMBIO: Agregamos "dr.*" para traer todos los IDs ocultos y poder editar
            const sql = `
                SELECT 
                    dr.*, 
                    a.NOMBRE_ACCION,
                    ae.ACCION_ESPECIFICA,
                    ta.NOMBRE_TA as AGENTE
                FROM detalle_registro dr
                LEFT JOIN accion a ON dr.ID_ACCION = a.ID_ACCION
                LEFT JOIN accion_especifica ae ON dr.ID_AE = ae.ID_AE
                LEFT JOIN tipo_agente ta ON dr.ID_TA = ta.ID_TA
                ORDER BY dr.ID_REGISTRO DESC
            `;
            const [filas] = await pool.query(sql);
            res.json(filas);
        } catch (error) {
            res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
    },

    eliminarRegistro: async (req, res) => {
        try {
            const { id } = req.params;
            const [resultado] = await pool.query('DELETE FROM detalle_registro WHERE ID_REGISTRO = ?', [id]);
            if (resultado.affectedRows === 0) return res.status(404).json({ error: 'El registro no existe.' });
            res.json({ mensaje: 'Registro eliminado permanentemente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el registro.' });
        }
    }
};

module.exports = RegistroController;