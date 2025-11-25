// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME || 'eduport_dev',
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: process.env.DB_PORT || 3306,
//     dialect: 'mysql'
//   },
//   test: {
//     dialect: 'sqlite',
//     storage: ':memory:'
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql'
//   }
// };







require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'lms_user',
    password: process.env.DB_PASSWORD || 'StrongPassword123!',
    database: process.env.DB_NAME || 'lms_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql'
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
};
