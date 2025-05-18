const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Journal = require('./journal.model');

const Notification = sequelize.define('Notification', {
  message: { type: DataTypes.TEXT },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'notifications', underscored: true });

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Journal, { foreignKey: 'journal_id' });

module.exports = Notification;


