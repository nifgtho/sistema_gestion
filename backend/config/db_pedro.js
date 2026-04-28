/**
 * ============================================================================
 * CONFIGURACIÓN DE LA BASE DE DATOS
 * Archivo: backend/config/db_pedro.js
 * ============================================================================
 */

// Importamos mysql2 con soporte para Promesas (async/await)
const mysql = require('mysql2/promise');

// Creamos el Pool de conexiones
// Un "Pool" mantiene varias conexiones abiertas listas para usarse,
// lo que hace que tu sistema sea mucho más rápido y no se cuelgue.
const pool = mysql.createPool({
    host: 'localhost',         // Servidor local (XAMPP, Laragon, etc.)
    user: 'root',              // Tu usuario de MySQL (usualmente 'root')
    password: '',              // Tu contraseña (déjalo en blanco si usas XAMPP/Laragon por defecto)
    database: 'db_darwin',     // El nombre exacto de tu base de datos según tu script SQL
    waitForConnections: true,  // Pone en fila las peticiones si todas las conexiones están ocupadas
    connectionLimit: 15,       // Número máximo de usuarios interactuando con la BD al mismo tiempo
    queueLimit: 0              // Límite de la fila de espera (0 = ilimitado)
});

// ============================================================================
// COMPROBACIÓN DE SALUD (Health Check)
// Esto probará la conexión apenas enciendas el servidor para avisarte si hay error
// ============================================================================
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos: db_darwin');
        connection.release(); // Siempre debemos devolver la conexión al Pool cuando terminamos
    })
    .catch(error => {
        console.error('❌ ERROR FATAL: No se pudo conectar a la base de datos.');
        console.error('Detalles:', error.message);
        console.error('👉 Asegúrate de que XAMPP/Laragon esté encendido y la base de datos exista.');
    });

// Exportamos el Pool para que nuestros Controladores puedan usarlo
module.exports = pool;