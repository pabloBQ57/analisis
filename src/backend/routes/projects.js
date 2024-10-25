import express from 'express';
import multer from 'multer';
import Project from '../models/Project.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuración de multer para almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
  },
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo proyecto con carga de archivo
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, description, hito, recurso } = req.body; // Añadir 'hito' y 'recurso'
    const filePath = req.file ? req.file.path : null;

    const project = await Project.create({ name, description, filePath, hito, recurso }); // Incluir 'hito' y 'recurso'
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para editar el nombre, descripción, hito y recurso de un proyecto
router.put('/:id', async (req, res) => {
  try {
    const { name, description, hito, recurso } = req.body; // Añadir 'hito' y 'recurso'
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await project.update({ name, description, hito, recurso }); // Incluir 'hito' y 'recurso'
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para eliminar un proyecto y su archivo asociado
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Eliminar el archivo físico si existe
    if (project.filePath) {
      fs.unlink(project.filePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        }
      });
    }

    // Eliminar el proyecto de la base de datos
    await project.destroy();
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll();
    console.log('Fetched projects:', projects); // Depuración
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
