// src/backend/controllers/testResultsController.js
import TestResult from '../models/TestResult.js'; // Asegúrate de que este modelo esté definido correctamente

// Controlador para obtener los resultados de las pruebas
export const getTestResults = async (req, res) => {
  try {
    const { projectId } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
    const results = await TestResult.findAll({ where: { projectId } }); // Buscar resultados por ID de proyecto
    res.json(results); // Enviar los resultados en formato JSON al frontend
  } catch (error) {
    console.error('Error al obtener los resultados de las pruebas:', error);
    res.status(500).json({ message: 'Error al obtener los resultados de las pruebas' });
  }
};
