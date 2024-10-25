import { useState, useEffect } from 'react';
import axios from 'axios';

function Defects() {
  const [defects, setDefects] = useState([]); // Estado para almacenar los defectos

  // Obtener la lista de defectos de la base de datos al cargar el componente
  useEffect(() => {
    axios.get('http://localhost:5000/api/defects')
      .then(res => setDefects(res.data))
      .catch(err => console.error('Error fetching defects:', err));
  }, []);

  return (
    <div>
      <h2>Lista de Defectos</h2>

      {/* Tabla de defectos */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Severidad</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estado</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Project ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Test Result ID</th>
          </tr>
        </thead>
        <tbody>
          {defects.map((defect) => (
            <tr key={defect.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.severity}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.projectId}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{defect.testResultId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Defects;
