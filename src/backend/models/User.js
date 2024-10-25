import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // La configuración de la base de datos

const User = sequelize.define('User', {
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'usuarios',  // Especificar el nombre de la tabla
  timestamps: false       // Deshabilitar createdAt y updatedAt
});

export default User;
