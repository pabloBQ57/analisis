import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING,
  },
  hito: {
    type: DataTypes.STRING, // Nuevo campo
  },
  recurso: {
    type: DataTypes.STRING, // Nuevo campo
  },
});

export default Project;
