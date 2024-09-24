require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/index');
require('./workers/emailworker'); 
const app = express();
const PORT = process.env.PORT || 5001;
const Arena = require('bull-arena');
const { Queue } = require('bullmq');
const checkDbConnection = require('./testDbConnection');


const arenaConfig = Arena({ 
  BullMQ:Queue,
  queues: [
    {
      name: "EmailQueue",
      type: "bullmq",
      hostId: "Email Worker",
      redis: {
        host: process.env.REDIS_URL,
        port: 6379,
      },
    },
  ],
},
{
  disableListen: true,
});

app.use('/queues', arenaConfig);



app.use(express.json());
app.use('/auth', authRoutes)

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

checkDbConnection().then(startServer); 