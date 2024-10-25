import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './TestResults.css'; // Importar el archivo CSS para estilos adicionales

function TestResults({ projectId }) {
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false); // Estado para mostrar más resultados

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/test-results/${projectId}`)
        .then((res) => {
          setTestResults(res.data);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError('Error al cargar los resultados de las pruebas.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [projectId]);

  // Mostrar los primeros 3 resultados si showAll es falso
  const displayedResults = showAll ? testResults : testResults.slice(0, 1);

  return (
    <div className="test-results-container">
      <h3>Resultados de las Pruebas</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Cargando resultados...</p>}
      {!loading && testResults.length === 0 && !error && (
        <p>No hay resultados de pruebas disponibles para este proyecto.</p>
      )}
      <ul className="test-results-list">
        {displayedResults.map((result, index) => (
          <li key={index} className="test-result-item">
            <strong>Status:</strong> {result.status}
            <pre className="test-log">{result.log}</pre>
          </li>
        ))}
      </ul>
      {/* Botón para ver más o ver menos */}
      {testResults.length > 3 && (
        <button className="show-more-button" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

// Definir los propTypes para validar las props del componente
TestResults.propTypes = {
  projectId: PropTypes.number.isRequired,
};

export default TestResults;
