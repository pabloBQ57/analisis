import express from 'express';
import TestResult from '../models/TestResult.js'; // Importar el modelo de resultados de prueba

const router = express.Router();

// Obtener todos los resultados de prueba
router.get('/', async (req, res) => {
  try {
    const testResults = await TestResult.findAll();
    res.json(testResults);
  } catch (error) {
    console.error('Error al obtener los resultados de las pruebas:', error); // Usar 'error' aquí
    res.status(500).json({ message: 'Error al obtener los resultados de las pruebas.' });
  }
});

// Obtener resultados de prueba para un proyecto específico
router.get('/:projectId', async (req, res) => {
  try {
    const testResults = await TestResult.findAll({ where: { projectId: req.params.projectId } });
    res.json(testResults);
  } catch (error) {
    console.error('Error al obtener los resultados de las pruebas para el proyecto:', error); // Usar 'error' aquí
    res.status(500).json({ message: 'Error al obtener los resultados de las pruebas para el proyecto.' });
  }
});

export default router;



