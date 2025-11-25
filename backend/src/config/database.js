// import { Sequelize } from 'sequelize';
// import { config } from './env.js';

// let sequelize;

// if (process.env.NODE_ENV === 'test') {
//   // Use SQLite in-memory for tests to avoid requiring a live MySQL instance
//   sequelize = new Sequelize('sqlite::memory:', { logging: false });
// } else {
//   sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
//     host: config.db.host,
//     port: config.db.port,
//     dialect: 'mysql',
//     logging: false
//   });
// }

// export { sequelize };






import { Sequelize } from 'sequelize';
import { config } from './env.js';

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
      host: config.db.host,
      port: Number(config.db.port),   // yaha change
      dialect: 'mysql',
      logging: false,
    }
  );
}

export { sequelize };
