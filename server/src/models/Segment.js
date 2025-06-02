import mongoose from "mongoose";

const SegmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  rule: {
    type: Object, 
    required: true
  },

  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Segment = mongoose.model("Segment", SegmentSchema);
export default Segment;
