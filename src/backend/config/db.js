// import { Sequelize }from'sequelize';

// // Configura la conexión a la base de datos
//  const sequelize = new Sequelize('analisis', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
// });
// export default sequelize;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: 'analisis',
  username: 'root',
  //password: ,
  host: 'localhost',
  port: '33065',
  dialect: 'mysql',
  pool: {
    max: 10, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    idle: 300000, // Tiempo máximo en milisegundos que una conexión puede estar inactiva en el pool antes de ser liberada (5 minutos)
    acquire: 30000 // Tiempo máximo en milisegundos que el pool intentará adquirir una conexión antes de lanzar un error
  }
});
export default sequelize;