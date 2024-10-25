// src/backend/routes/testPlans.js
import express from 'express';
import TestPlan from '../models/TestPlan.js';
import Project from '../models/Project.js';

const router = express.Router();

// Crear un nuevo plan de pruebas
router.post('/', async (req, res) => {
  try {
    const { name, projectId, acceptanceCriteria, testType } = req.body;

    // Obtener el proyecto para vincular su archivo
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Crear el plan de prueba
    const testPlan = await TestPlan.create({
      name,
      projectId,
      acceptanceCriteria,
      testType,
      filePath: project.filePath,  // Asociar la ruta del archivo al plan de prueba
    });

    res.status(201).json(testPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener los planes de prueba para un proyecto específico
// src/backend/routes/testPlans.js
router.get('/', async (req, res) => {
  try {
    // Obtener todos los planes de prueba
    const testPlans = await TestPlan.findAll();

    if (!testPlans || testPlans.length === 0) {
      return res.status(404).json({ message: 'No se encontraron planes de prueba' });
    }

    console.log('Planes de prueba encontrados:', testPlans);
    res.json(testPlans);
  } catch (error) {
    console.error('Error al obtener planes de prueba:', error);
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un plan de prueba
router.put('/:id', async (req, res) => {
  try {
    const { name, acceptanceCriteria, testType, projectId } = req.body;

    // Obtener el plan de prueba existente
    const testPlan = await TestPlan.findByPk(req.params.id);
    if (!testPlan) {
      return res.status(404).json({ message: 'Plan de prueba no encontrado' });
    }

    // Obtener el proyecto para verificar y actualizar la ruta del archivo
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Actualizar el plan de prueba con los nuevos datos
    await testPlan.update({
      name,
      acceptanceCriteria,
      testType,
      filePath: project.filePath,  // Actualizar la ruta del archivo en el plan de prueba
    });

    res.json(testPlan);
  } catch (error) {
    console.error('Error al actualizar el plan de prueba:', error);
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un plan de prueba
router.delete('/:id', async (req, res) => {
  try {
    const testPlan = await TestPlan.findByPk(req.params.id);
    if (!testPlan) {
      return res.status(404).json({ message: 'Plan de prueba no encontrado' });
    }

    await testPlan.destroy();
    res.json({ message: 'Plan de prueba eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el plan de prueba:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
