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
      database: process.env.DB_NAME || 'queues',
      user: process.env.DB_USER || 'baro',
      password: process.env.DB_PASS || 'gVUsyFHXxL2oCuZSfUUg7uj4gtsIffpD',
      host: process.env.DB_HOST || 'dpg-cs35ckpu0jms7394o220-a.oregon-postgres.render.com',
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
