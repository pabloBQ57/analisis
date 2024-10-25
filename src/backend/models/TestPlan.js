// models/TestPlan.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TestPlan = sequelize.define('TestPlan', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Cambiar a true para permitir valores nulos
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acceptanceCriteria: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  testType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default TestPlan;
