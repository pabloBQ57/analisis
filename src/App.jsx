import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Projects from './pages/Projects';
import TestPlans from './pages/TestPlans';
import TestExecution from './pages/TestExecution';
import Defects from './pages/Defects';
import Reports from './pages/Reports';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar el token en localStorage cada vez que se monta la app
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);  // Terminamos la verificación
  }, []);

  useEffect(() => {
    // Eliminar el token al cerrar la pestaña o el navegador
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
    };

    // Añadir evento para cuando se cierre el navegador
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Eliminar evento al desmontar el componente
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Mostrar mensaje de carga mientras se verifica el estado de autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      {/* Mostrar el navbar solo si está autenticado */}
      {isAuthenticated && (
        <nav>
          <ul>
            <li><Link to="/projects">Proyectos</Link></li>
            <li><Link to="/test-plans">Planificación de Pruebas</Link></li>
            <li><Link to="/test-execution">Ejecución de Pruebas</Link></li>
            <li><Link to="/defects">Gestión de Defectos</Link></li>
            <li><Link to="/reports">Informes</Link></li>
          </ul>
        </nav>
      )}

      <div className="app-container">
        <Routes>
          {/* Mostrar el login solo si no está autenticado */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/projects" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />

          {/* Rutas protegidas */}
          <Route path="/projects" element={isAuthenticated ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/test-plans" element={isAuthenticated ? <TestPlans /> : <Navigate to="/login" />} />
          <Route path="/test-execution" element={isAuthenticated ? <TestExecution /> : <Navigate to="/login" />} />
          <Route path="/defects" element={isAuthenticated ? <Defects /> : <Navigate to="/login" />} />
          <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />

          {/* Redirigir cualquier ruta no definida al login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
