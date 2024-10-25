import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TestResult = sequelize.define('TestResult', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // "success" o "failure"
    allowNull: false,
  },
  log: {
    type: DataTypes.TEXT, // Almacenar el log de la prueba
    allowNull: true,
  },
});

export default TestResult;
