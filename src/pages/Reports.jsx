import { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [projects, setProjects] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [summary, setSummary] = useState(null); // Estado para el resumen
  const [defectDescription, setDefectDescription] = useState(''); // Descripción del defecto
  const [severity, setSeverity] = useState('low'); // Severidad del defecto
  const [selectedTestResult, setSelectedTestResult] = useState(null); // Para seleccionar el resultado de la prueba

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error fetching projects:', err));
  };

  const fetchTestResults = (projectId) => {
    setSelectedProjectId(projectId);
    axios.get(`http://localhost:5000/api/test-results/${projectId}`)
      .then((res) => {
        setTestResults(res.data);
        generateSummary(res.data); // Generar el resumen basado en los resultados
      })
      .catch((err) => console.error('Error fetching test results:', err));
  };

  const generateSummary = (results) => {
    const totalTests = results.length;
    const successCount = results.filter(result => result.status === 'success').length;
    const failureCount = results.filter(result => result.status === 'failure').length;

    setSummary({
      total: totalTests,
      success: successCount,
      failure: failureCount
    });
  };

  // Manejar la creación del defecto
  const handleCreateDefect = (testResultId) => {
    if (!defectDescription) {
      alert("Por favor, proporciona una descripción del defecto.");
      return;
    }

    axios.post('http://localhost:5000/api/defects', {
      projectId: selectedProjectId, // El ID del proyecto al que pertenece el resultado
      testResultId, // El resultado de la prueba específico
      description: defectDescription, // Descripción del defecto
      severity: severity, // Severidad seleccionada
    })
      .then(() => {
        alert('Defecto creado exitosamente.');
        setDefectDescription(''); // Limpiar la descripción
        setSeverity('low'); // Restablecer la severidad
      })
      .catch((err) => console.error('Error creating defect:', err));
  };

  return (
    <div className="reports-container">
      <h3>Informes de Pruebas</h3>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <span>{project.name}</span>
            <button className="view-button" onClick={() => fetchTestResults(project.id)}>Ver Pruebas</button>
          </li>
        ))}
      </ul>

      {selectedProjectId && summary && (
        <div className="results-container">
          <h4>Informe de Pruebas para el Proyecto ID: {selectedProjectId}</h4>
          <p><strong>Total de pruebas ejecutadas:</strong> {summary.total}</p>
          <p><strong>Éxito:</strong> {summary.success}</p>
          <p><strong>Fallo:</strong> {summary.failure}</p>

          <h5>Detalles de las Pruebas:</h5>
          <ul>
            {testResults.map((result, index) => (
              <li 
                key={index} 
                style={{
                  backgroundColor: result.status === 'failure' ? '#f8d7da' : '#d4edda', // Rojo pálido para fallos, verde para éxito
                  color: result.status === 'failure' ? '#721c24' : '#155724',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: `1px solid ${result.status === 'failure' ? '#f5c6cb' : '#c3e6cb'}` // Borde según estado
                }}
              >
                <strong>Estado:</strong> {result.status}
                <pre>{result.log}</pre>
                
                {result.status === 'failure' && (
                  <div>
                    <button onClick={() => setSelectedTestResult(result.id)}>Crear Defecto</button>

                    {/* Mostrar el formulario de creación de defectos si se selecciona el resultado */}
                    {selectedTestResult === result.id && (
                      <div style={{ marginTop: '10px' }}>
                        <textarea
                          placeholder="Descripción del defecto"
                          value={defectDescription}
                          onChange={(e) => setDefectDescription(e.target.value)}
                          style={{ width: '100%', padding: '10px' }}
                        ></textarea>
                        <select 
                          value={severity} 
                          onChange={(e) => setSeverity(e.target.value)}
                          style={{ marginTop: '10px', width: '100%', padding: '10px' }}
                        >
                          <option value="bajo">Bajo</option>
                          <option value="medio">Medio</option>
                          <option value="alto">Alto</option>
                        </select>
                        <button 
                          onClick={() => handleCreateDefect(result.id)} 
                          style={{ marginTop: '10px' }}
                        >
                          Enviar Defecto
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Reports;


