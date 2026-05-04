const pool = require('../config/db_pedro');

const AuthController = {
    // 1. REGISTRAR NUEVO USUARIO
    registrar: async (req, res) => {
        try {
            const { nombre_completo, email, password } = req.body;
            
            if (!nombre_completo || !email || !password) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }

            // Verificar si el correo ya existe
            const [existe] = await pool.query('SELECT email FROM usuarios WHERE email = ?', [email]);
            if (existe.length > 0) {
                return res.status(409).json({ error: 'Este correo ya está registrado' });
            }

            // Insertar usuario
            const sql = 'INSERT INTO usuarios (nombre_completo, email, password) VALUES (?, ?, ?)';
            await pool.query(sql, [nombre_completo, email, password]);
            
            res.status(201).json({ mensaje: 'Usuario registrado con éxito. Ya puedes iniciar sesión.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // 2. INICIAR SESIÓN
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Ingresa correo y contraseña' });
            }

            // Buscar al usuario
            const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
            
            if (usuarios.length === 0) {
                return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
            }

            // No enviamos la contraseña al frontend por seguridad
            const usuarioValido = usuarios[0];
            delete usuarioValido.password;

            res.json({ 
                mensaje: 'Bienvenido', 
                usuario: usuarioValido 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = AuthController;