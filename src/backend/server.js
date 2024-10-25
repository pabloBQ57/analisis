import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

// Importar modelos
import './models/Project.js';
import './models/TestPlan.js';
import './models/Defect.js';
import './models/TestResult.js';
import './models/User.js'; // Importar el modelo de usuario

// Importar rutas
import projectRoutes from './routes/projects.js';
import testPlanRoutes from './routes/testPlans.js';
import defectRoutes from './routes/defects.js';
import authRoutes from './routes/auth.js'; // Importar las rutas de autenticación
import testExecutionRoutes from './routes/testExecution.js';
import testResultRoutes from './routes/testResults.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes); // Usar las rutas de autenticación
app.use('/api/projects', projectRoutes);
app.use('/api/test-plans', testPlanRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/test-execution', testExecutionRoutes);
app.use('/api/test-results', testResultRoutes);

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Middleware para manejar errores de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores generales
app.use((error, req, res) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Inicializar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

