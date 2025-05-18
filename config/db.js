const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/journal_toddle' , {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Enforce SSL
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  },
});
module.exports = sequelize;