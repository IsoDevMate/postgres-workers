const { Queue } = require('bullmq');
const Redis =require( "../utils/redisclient");

const myMessageQueue=new Queue('EmailQueue', {
    connection:Redis.duplicate(),
})

module.exports = myMessageQueue;
