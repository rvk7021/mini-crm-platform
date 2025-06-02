import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audienceSize: {
    type: Number,
    required: true
  },
  pendingCount: {
    type: Number,
    required: true
  },
  totalSent: {
    type: Number,
    default: 0
  },
  totalFailed: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Campaign', campaignSchema);
