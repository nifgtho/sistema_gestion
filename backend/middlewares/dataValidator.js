/**
 * ============================================================================
 * MIDDLEWARE: VALIDADOR DE DATOS DE ENTRADA
 * Archivo: backend/middlewares/dataValidator.js
 * ============================================================================
 */

const DataValidator = {
    
    /**
     * Validador Genérico de Campos Obligatorios.
     * @param {Array} camposRequeridos - Lista de nombres de campos que no pueden faltar.
     * @returns {Function} Middleware de Express
     */
    requerirCampos: (camposRequeridos) => {
        return (req, res, next) => {
            const datosEntrantes = req.body;
            const camposFaltantes = [];

            // Recorremos la lista de campos que exigimos
            camposRequeridos.forEach(campo => {
                // Verificamos si el campo es undefined, null o un texto vacío
                if (datosEntrantes[campo] === undefined || 
                    datosEntrantes[campo] === null || 
                    String(datosEntrantes[campo]).trim() === '') {
                    
                    camposFaltantes.push(campo);
                }
            });

            // Si encontramos que faltan campos, bloqueamos la petición
            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    error: 'Error de validación: Faltan datos obligatorios.',
                    camposFaltantes: camposFaltantes
                });
            }

            // Si todo está perfecto, le decimos al servidor que continúe (next)
            // Esto pasará la solicitud al Controlador.
            next();
        };
    },

    /**
     * Validador de ID para las rutas PUT y DELETE.
     * Asegura que el ID de la URL sea un número válido.
     */
    validarIdParam: (req, res, next) => {
        const { id } = req.params;
        
        // Verifica si el ID no es un número (NaN = Not a Number)
        if (isNaN(id) || parseInt(id) <= 0) {
            return res.status(400).json({
                error: 'Error de validación: El ID proporcionado no es válido.'
            });
        }
        
        next();
    }
};

module.exports = DataValidator;