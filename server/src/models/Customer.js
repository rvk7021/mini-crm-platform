import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  items: [{
    type: String,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: String,
    trim: true,
  }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  orders: {
    type: [orderSchema],
    default: [],
  },
  preferredCategory: {
    type: String,
    trim: true,
  },
  preferredDay: {
    type: String,
    trim: true,
  },
  preferredChannel: {
    type: String,
    trim: true,
  },
  lastOrder: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
