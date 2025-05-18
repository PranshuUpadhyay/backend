const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Journal = require('./journal.model');
const User = require('./user.model');

const JournalTag = sequelize.define('JournalTag', {
    journal_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER
  },{
  tableName: 'journal_tags',
  underscored: true
});

Journal.belongsToMany(User, { through: JournalTag, as: 'tagged', foreignKey: 'journal_id', otherKey: 'student_id' });
User.belongsToMany(Journal, { through: JournalTag, as: 'taggedJournals', foreignKey: 'student_id', otherKey: 'journal_id' });

module.exports = JournalTag;