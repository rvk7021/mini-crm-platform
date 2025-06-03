import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

export const messageQueue = new Queue('messageQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
