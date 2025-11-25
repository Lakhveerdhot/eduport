import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const NotificationLog = sequelize.define('NotificationLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notificationTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

export default NotificationLog;
