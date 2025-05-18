const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/journal_toddle');
module.exports = sequelize;