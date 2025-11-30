import app from './app.js';
import { config } from './config/env.js';
import { sequelize } from './config/database.js';
import { startNotificationScheduler } from './services/notificationService.js';

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync models in non-production only if needed. In production prefer migrations.
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('Database synced');
    }

    const PORT = process.env.PORT || config.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Start background scheduler
    startNotificationScheduler();
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};
start();
