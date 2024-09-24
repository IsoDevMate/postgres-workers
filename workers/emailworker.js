const { Worker } = require('bullmq');
const sgMail = require('@sendgrid/mail');
const Redis = require('../utils/redisclient');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailWorker = new Worker('EmailQueue', async (job) => {
  const { to, subject, text, html } = job.data;

  const msg = {
    to,
    from: 'oumabarack1047@gmail.com',
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    return 'Success';
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
 
}, { connection: Redis.duplicate() });

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

module.exports = emailWorker;