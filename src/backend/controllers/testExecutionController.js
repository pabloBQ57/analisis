import { exec } from 'child_process';
import Project from '../models/Project.js';
import TestResult from '../models/TestResult.js';

export const executeTest = async (req, res) => {
  const { projectId } = req.params;
  const { testType } = req.body; // Obtener el tipo de prueba del cuerpo de la solicitud

  try {
    const project = await Project.findByPk(projectId);
    if (!project || !project.filePath) {
      return res.status(404).json({ message: 'Proyecto o archivo no encontrado' });
    }

    // Validar el tipo de archivo (opcional)
    if (!project.filePath.endsWith('.js')) {
      return res.status(400).json({ message: 'El archivo no es un archivo JavaScript válido.' });
    }

    // Seleccionar el comando a ejecutar según el tipo de prueba
    let command;
    switch (testType) {
      case 'unit':
        command = `node ${project.filePath} --unit-test`; // Agrega opciones para pruebas unitarias
        break;
      case 'integration':
        command = `node ${project.filePath} --integration-test`; // Agrega opciones para pruebas de integración
        break;
      case 'simulation':
        command = `node ${project.filePath} --simulation`; // Agrega opciones para pruebas simuladas
        break;
      default:
        return res.status(400).json({ status: 'error', message: 'Tipo de prueba no válido' });
    }

    exec(command, async (error, stdout, stderr) => {
      try {
        let status = error ? 'failure' : 'success';
        let log = stdout || stderr;

        // Guardar el resultado de la prueba en la base de datos
        const testResult = await TestResult.create({
          projectId,
          status,
          log,
        });

        // Devolver el resultado
        return res.status(200).json(testResult);
      } catch (dbError) {
        console.error('Error al guardar el resultado de la prueba:', dbError);
        return res.status(500).json({ message: 'Error al guardar el resultado de la prueba en la base de datos.' });
      }
    });
  } catch (error) {
    console.error('Error ejecutando la prueba:', error);
    res.status(500).json({ message: error.message });
  }
};
