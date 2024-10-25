import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nombreUsuario || !password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);  // Mostrar indicador de carga

    try {
      // Realizar la solicitud de inicio de sesión
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        nombre_usuario: nombreUsuario,
        password: password
      });

      // Mostrar mensaje de éxito
      toast.success(response.data.message || 'Inicio de sesión exitoso');

      // Almacenar el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Actualizar estado de autenticación
      setIsAuthenticated(true);

    } catch (error) {
      console.log('Error en la respuesta del servidor:', error.response); // Añadir un log para ver el error

      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          // Credenciales incorrectas o usuario no encontrado
          toast.error(error.response.data.message || 'Error en el inicio de sesión');
        } else {
          // Otro tipo de error
          toast.error('Error en el servidor. Intenta nuevamente.');
        }
      } else {
        // Error de red o de conexión
        toast.error('No se pudo conectar con el servidor. Por favor, intenta más tarde.');
      }
    } finally {
      setLoading(false);  // Ocultar indicador de carga
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Ingresa tu nombre de usuario"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

// Añadir PropTypes para validar que setIsAuthenticated es una función requerida
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired
};

export default Login;
