import { sequelize } from '../config/database.js';

export default async function setupTest() {
  // Ensure we're in test mode
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
}
