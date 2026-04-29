const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_darwin',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos: db_darwin');
        connection.release();
    })
    .catch(error => {
        console.error('❌ ERROR: No se pudo conectar a la base de datos.', error.message);
    });

module.exports = pool;