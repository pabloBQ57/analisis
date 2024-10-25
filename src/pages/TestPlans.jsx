import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TestPlans() {
  const [testPlan, setTestPlan] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [testType, setTestType] = useState('unit');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [testPlans, setTestPlans] = useState([]);
  const [editPlanId, setEditPlanId] = useState(null);
  const [selectedProjectFilePath, setSelectedProjectFilePath] = useState(''); // Nuevo estado para el filePath

  useEffect(() => {
    fetchProjects();
    fetchAllTestPlans();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      // Actualiza el filePath al seleccionar un nuevo proyecto
      const selectedProject = projects.find(project => project.id === Number(selectedProjectId));
      setSelectedProjectFilePath(selectedProject ? selectedProject.filePath : '');
    }
  }, [selectedProjectId, projects]);

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0].id);
          setSelectedProjectFilePath(res.data[0].filePath); // Establecer filePath del primer proyecto
        }
      })
      .catch((err) => console.error('Error al obtener proyectos:', err));
  };

  const fetchAllTestPlans = () => {
    axios.get('http://localhost:5000/api/test-plans')
      .then((res) => setTestPlans(res.data))
      .catch((err) => console.error('Error al obtener planes de prueba:', err));
  };

  const handleCreateTestPlan = () => {
    if (!testPlan || !acceptanceCriteria || !selectedProjectId || !selectedProjectFilePath) {
      toast.error('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    const planData = {
      name: testPlan,
      projectId: selectedProjectId,
      acceptanceCriteria,
      testType,
      filePath: selectedProjectFilePath, // Agregar el filePath al plan
    };

    if (editPlanId) {
      // Editar plan de prueba existente
      axios.put(`/api/test-plans/${editPlanId}`, planData)
        .then(() => {
          toast.success('Plan de prueba actualizado exitosamente');
          fetchAllTestPlans();
          resetForm();
        })
        .catch(err => console.error('Error al actualizar el plan de prueba:', err));
    } else {
      // Crear nuevo plan de prueba
      axios.post(`/api/test-plans`, planData)
        .then(() => {
          toast.success('Plan de prueba creado exitosamente');
          fetchAllTestPlans();
          resetForm();
        })
        .catch(err => console.error('Error al crear el plan de prueba:', err));
    }
  };

  const handleEditClick = (plan) => {
    setEditPlanId(plan.id);
    setTestPlan(plan.name);
    setAcceptanceCriteria(plan.acceptanceCriteria);
    setTestType(plan.testType);
    setSelectedProjectId(plan.projectId);
    setSelectedProjectFilePath(plan.filePath);
  };

  const handleDeleteClick = (planId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan de prueba?')) {
      axios.delete(`/api/test-plans/${planId}`)
        .then(() => {
          toast.success('Plan de prueba eliminado exitosamente');
          fetchAllTestPlans();
        })
        .catch(err => console.error('Error al eliminar el plan de prueba:', err));
    }
  };

  const resetForm = () => {
    setTestPlan('');
    setAcceptanceCriteria('');
    setTestType('unit');
    setEditPlanId(null);
    setSelectedProjectFilePath(''); // Resetear el filePath
  };

  return (
    <div>
      <h2>Planificación de Pruebas</h2>

      <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <input
        type="text"
        value={testPlan}
        onChange={(e) => setTestPlan(e.target.value)}
        placeholder="Nombre del plan de prueba"
      />

      <textarea
        value={acceptanceCriteria}
        onChange={(e) => setAcceptanceCriteria(e.target.value)}
        placeholder="Criterios de aceptación"
      />

      <select value={testType} onChange={(e) => setTestType(e.target.value)}>
        <option value="unit">Pruebas Unitarias</option>
        <option value="integration">Pruebas de Integración</option>
        <option value="simulation">Pruebas Simuladas</option>
      </select>

      <button onClick={handleCreateTestPlan}>
        {editPlanId ? 'Guardar Cambios' : 'Crear Plan de Pruebas'}
      </button>

      <h3>Lista de Planes de Pruebas</h3>
      <table className="project-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Plan</th>
            <th>Criterios de Aceptación</th>
            <th>Tipo de Prueba</th>
            <th>Proyecto Asociado</th>
            <th>Ruta del Archivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {testPlans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.name}</td>
              <td>{plan.acceptanceCriteria}</td>
              <td>{plan.testType}</td>
              <td>{plan.projectId}</td>
              <td>{plan.filePath}</td> {/* Mostrar filePath */}
              <td>
                <button onClick={() => handleEditClick(plan)}>Editar</button>
                <button onClick={() => handleDeleteClick(plan.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default TestPlans;
