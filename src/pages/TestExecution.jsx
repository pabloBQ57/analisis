import { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TestExecution() {
  const [testPlans, setTestPlans] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchTestPlans(); // Obtener todas las planificaciones de pruebas
  }, []);

  const fetchTestPlans = () => {
    axios.get('http://localhost:5000/api/test-plans') // Cambiar a la ruta correcta
      .then((res) => setTestPlans(res.data))
      .catch((err) => console.error('Error al obtener planes de prueba:', err));
  };

  const handlePreviewFile = async (filePath) => {
    try {
      const res = await axios.get(`http://localhost:5000/${filePath}`, {
        responseType: 'text',
      });
      setFileContent(res.data);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      toast.error('Error al cargar el archivo.');
    }
  };

  const handleRunTest = (planId, testType) => {
    axios.post(`http://localhost:5000/api/test-execution/${planId}`, {
      testType,
    })
      .then((res) => {
        toast.success(`Resultado de la prueba: ${res.data.status}`);
      })
      .catch((err) => {
        console.error('Error al ejecutar la prueba:', err);
        toast.error('Error al ejecutar la prueba.');
      });
  };

  return (
    <div>
      <h3>Ejecución de Pruebas</h3>
      <table className="test-plan-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Plan</th>
            <th>Archivo</th>
            <th>Tipo de Prueba</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {testPlans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.name}</td>
              <td>{plan.filePath}</td>
              <td>{plan.testType}</td>
              <td>
                <button onClick={() => handlePreviewFile(plan.filePath)}>Previsualizar Código</button>
                <button onClick={() => handleRunTest(plan.id, plan.testType)}>Ejecutar Prueba</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPreviewOpen && (
        <div className="preview-container">
          <h3>Previsualización de Código</h3>
          <CodeMirror
            value={fileContent}
            options={{
              readOnly: true,
              mode: 'javascript',
            }}
          />
          <button onClick={() => setIsPreviewOpen(false)}>Cerrar Previsualización</button>
        </div>
      )}

      {/* Contenedor de notificaciones */}
      <ToastContainer />
    </div>
  );
}

export default TestExecution;
