const Redis = require('ioredis');
require('dotenv').config();

const  REDIS_URL  = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('REDIS_URL is not defined in the environment variables');
  process.exit(1);
}

console.log('Redis URL:', REDIS_URL);

const clientConnection = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

clientConnection.on("connect", () => {
  console.log(`Connected to redis`);
});

clientConnection.on("error", (err) => {
  console.log(`Error in Redis connection ${err}`);
});

clientConnection.on("end", () => {
  console.log("Client disconnected from redis");
});

module.exports = clientConnection;