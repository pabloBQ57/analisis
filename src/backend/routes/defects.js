import express from 'express';
import Defect from '../models/Defect.js'; // Importa el modelo Defect

const router = express.Router();

// Ruta para obtener todos los defectos
router.get('/', async (req, res) => {
  try {
    const defects = await Defect.findAll(); // Obtener todos los defectos de la base de datos
    res.status(200).json(defects);
  } catch (error) {
    console.error('Error al obtener los defectos:', error.message);
    res.status(500).json({ message: 'Error al obtener los defectos' });
  }
});

// Ruta para crear un nuevo defecto
router.post('/', async (req, res) => {
  const { projectId, testResultId, description, severity } = req.body;

  try {
    // Crear el defecto en la base de datos
    const defect = await Defect.create({
      projectId: projectId,  // projectId en texto
      testResultId: testResultId,
      description: description,
      severity: severity,  // "bajo", "medio", "alto"
      status: 'abierto', // Estado por defecto "abierto"
    });

    res.status(201).json(defect);
  } catch (error) {
    console.error('Error al crear el defecto:', error.message);
    res.status(500).json({ message: 'Error al crear el defecto' });
  }
});

export default router;
