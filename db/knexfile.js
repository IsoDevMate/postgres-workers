require('dotenv').config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);


module.exports = {

  development:  {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASS ,
      host: process.env.DB_HOST  ,
      port: process.env.DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
    }
  },
  
}; 
