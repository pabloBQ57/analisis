import { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Projects() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hito, setHito] = useState('');
  const [recurso, setRecurso] = useState('.js'); // Valor predeterminado para recursos
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editProjectId, setEditProjectId] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error al recuperar proyectos:', err));
  };

  const handleCreateProject = () => {
    if (!name || !description || (!file && !editProjectId)) {
      toast.error('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    if (editProjectId) {
      axios.put(`http://localhost:5000/api/projects/${editProjectId}`, {
        name,
        description,
        hito,
        recurso,
      })
      .then(() => {
        resetForm();
        fetchProjects();
        toast.success('Proyecto editado con éxito.');
      })
      .catch(err => {
        console.error('Error al editar el proyecto:', err);
        toast.error('Error al editar el proyecto.');
      });
    } else {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('hito', hito);
      formData.append('recurso', recurso);
      formData.append('file', file);

      axios.post('http://localhost:5000/api/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        resetForm();
        fetchProjects();
        toast.success('Proyecto creado con éxito.');
      })
      .catch(err => {
        console.error('Error al crear el proyecto:', err);
        toast.error('Error al crear el proyecto.');
      });
    }
  };

  const handleEditClick = (project) => {
    setEditProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
    setHito(project.hito);
    setRecurso(project.recurso);
  };

  const handleDeleteProject = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`)
      .then(() => {
        fetchProjects();
        toast.success('Proyecto eliminado correctamente.');
      })
      .catch(err => {
        console.error('Error al eliminar el proyecto:', err);
        toast.error('Error al eliminar el proyecto.');
      });
  };

  const handlePreviewFile = async (filePath) => {
    try {
      const res = await axios.get(`http://localhost:5000/${filePath}`, {
        responseType: 'text',
      });
      setFileContent(res.data);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error al recuperar el contenido del archivo:', error);
      toast.error('Error al cargar el archivo.');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setHito('');
    setRecurso('.js');
    setFile(null);
    setEditProjectId(null);
  };

  return (
    <div>
      <h2>{editProjectId ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del Proyecto"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del Proyecto"
      />
      <input
        type="text"
        value={hito}
        onChange={(e) => setHito(e.target.value)}
        placeholder="Hito"
      />
      <select value={recurso} onChange={(e) => setRecurso(e.target.value)}>
       
        <option value=".js">JavaScript</option>
       
      </select>
      {!editProjectId && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}
      <button onClick={handleCreateProject}>
        {editProjectId ? 'Guardar Cambios' : 'Crear Proyecto'}
      </button>

      <h3>Lista de Proyectos</h3>
      <table className="project-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Hito</th>
            <th>Recurso</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Archivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.hito}</td>
              <td>{project.recurso}</td>
              <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              <td>{new Date(project.updatedAt).toLocaleDateString()}</td>
              <td>{project.filePath}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditClick(project)}>Editar</button>
                <button className="delete-button" onClick={() => handleDeleteProject(project.id)}>Eliminar</button>
                <button onClick={() => handlePreviewFile(project.filePath)}>Previsualizar Código</button>
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

      <ToastContainer />
    </div>
  );
}

export default Projects;
