import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { messageQueue } from '../queues/messageQueue.js';
import CommunicationLog from '../models/CommunicationLog.js';
import Campaign from '../models/Campaign.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

messageQueue.process(async (job) => {
  const { communicationLogId, customerName, message, campaignId } = job.data;

  const success = Math.random() < 0.8;
  const status = success ? 'SENT' : 'FAILED';

  await CommunicationLog.findByIdAndUpdate(communicationLogId, { status });

  await Campaign.findByIdAndUpdate(campaignId, {
    $inc: {
      pendingCount: -1,
      ...(status === 'SENT' ? { totalSent: 1 } : { totalFailed: 1 }),
    },
  });
});
