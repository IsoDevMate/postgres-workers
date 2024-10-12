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
const cors = require('cors');
const bodyParser = require('body-parser');

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

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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