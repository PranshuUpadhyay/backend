const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Journal = require('./journal.model');

const Attachment = sequelize.define('Attachment', {
  journal_id: { type: DataTypes.INTEGER, allowNull: false }, 
  type: { type: DataTypes.ENUM('image', 'video', 'url', 'pdf'), allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'attachments', underscored: true });

Attachment.belongsTo(Journal, { foreignKey: 'journal_id' });
Journal.hasMany(Attachment, { foreignKey: 'journal_id' });

module.exports = Attachment;