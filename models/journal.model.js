const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Journal = sequelize.define('Journal', {
  description: { type: DataTypes.TEXT, allowNull: false },
  published_at: { type: DataTypes.DATE, allowNull: true },
  published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'journals', underscored: true });

Journal.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Journal, { foreignKey: 'created_by' });

module.exports = Journal;