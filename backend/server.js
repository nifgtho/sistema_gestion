/**
 * ============================================================================
 * ARCHIVO PRINCIPAL DEL SERVIDOR (Entry Point)
 * Archivo: backend/server.js
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// 1. Inicializar la aplicación Express
const app = express();

// 2. Middlewares Globales (Configuraciones base)
// CORS permite que el frontend (interfaz) se comunique con el backend (API) sin bloqueos de seguridad
app.use(cors()); 
// Habilita al servidor para entender y procesar información enviada en formato JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. Servir el Frontend Estático
// Esto conecta la carpeta 'frontend' para que Node.js la muestre automáticamente
app.use(express.static(path.join(__dirname, '../frontend')));

// 4. Importar los Enrutadores (Nuestras rutas API)
const registroRoutes = require('./routes/registro.routes');
const accionRoutes = require('./routes/accion.routes');
const zonaRoutes = require('./routes/zona.routes');
const recursoRoutes = require('./routes/recurso.routes');

// 5. Montar las Rutas en la API (Definir las URLs base)
app.use('/api/detalle_registro', registroRoutes);
app.use('/api/accion', accionRoutes);
app.use('/api/zona', zonaRoutes);
app.use('/api/recurso', recursoRoutes);

// 6. Manejo de la ruta principal (Redirigir a la interfaz visual)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 7. Middleware para Rutas No Encontradas (Error 404 en la API)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en la API de SAE.' });
});

// 8. Encender el Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 SISTEMA SAE - SERVIDOR ARRANCADO CON ÉXITO`);
    console.log(`=============================================================`);
    console.log(`🌐 Interfaz Web (Frontend): http://localhost:${PORT}`);
    console.log(`🔌 Endpoints API (Backend): http://localhost:${PORT}/api`);
    console.log(`=============================================================\n`);
    console.log(`Esperando conexiones... (Presiona CTRL+C para detener)`);
});