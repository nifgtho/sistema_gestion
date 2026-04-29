const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));

// 3. Rutas (Importaciones)
const accionRoutes = require('./routes/accion.routes');
const zonaRoutes = require('./routes/zona.routes');
const recursoRoutes = require('./routes/recurso.routes');
const accionEspecRoutes = require('./routes/accionEspec.routes');
const subaccionRoutes = require('./routes/subaccion.routes');
const actividadRoutes = require('./routes/actividad.routes');
// 👉 ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA!
const registroRoutes = require('./routes/registro.routes');


// 4. Endpoints (Conexión de rutas)
app.use('/api/accion', accionRoutes);
app.use('/api/zona', zonaRoutes);
app.use('/api/recurso', recursoRoutes);
app.use('/api/accion_especifica', accionEspecRoutes);
app.use('/api/subaccion', subaccionRoutes);
app.use('/api/actividad', actividadRoutes);
// 👉 ¡Y AQUÍ ESTÁ LA SEGUNDA LÍNEA QUE FALTABA!
app.use('/api/detalle_registro', registroRoutes);


// 5. Raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 6. 404 API
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

// 7. Servidor
const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 SERVIDOR INICIADO`);
    console.log(`👉 ${URL}`);
    console.log(`=========================================\n`);
});