require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/index');
require('./workers/emailworker'); 
const app = express();
const PORT = process.env.PORT || 5001;
const Arena = require('bull-arena');
const { Queue } = require('bullmq');
const checkDbConnection = require('./testDbConnection');
const cron = require('node-cron');

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

cron.schedule('*/5 * * * *', () => {
  console.log('Running keep-alive task');
  https.get(`https://losh-site.onrender.com/keep-alive`, (resp) => {
    console.log('Keep-alive request sent');
  }).on('error', (err) => {
    console.log('Error in keep-alive request: ' + err.message);
  });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

checkDbConnection().then(startServer); 