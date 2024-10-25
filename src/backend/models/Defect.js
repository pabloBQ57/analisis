import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Defect = sequelize.define('Defect', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('bajo', 'medio', 'alto'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('abierto', 'en progreso', 'cerrado'),
    defaultValue: 'abierto',
  },
  projectId: {
    type: DataTypes.INTEGER, // Ahora projectId es de tipo texto
    allowNull: false,
  },
  testResultId: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'defects',
  timestamps: true,
});

export default Defect;
