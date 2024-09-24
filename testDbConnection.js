// checkDbConnection.js
require('dotenv').config();
const knex = require('knex');
const knexfile = require('./db/knexfile');


const db = knex(knexfile.development);

// Function to check database connection
const checkDbConnection = () => {
  return db.raw('SELECT 1')
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((err) => {
      console.error('Database connection failed:');
      console.error(err);
      console.error('Connection details:', knexfile.development.connection);
      process.exit(1); // Exit process if DB connection fails
    });
};

module.exports = checkDbConnection;
