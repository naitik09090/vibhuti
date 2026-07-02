import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  loanType: {
    type: String,
    required: [true, 'Loan type is required'],
    trim: true,
  },
  loanAmount: {
    type: Number,
    default: 0,
  },
  loanTenureYears: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'In Review', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  documentUrls: [
    {
      type: String,
    }
  ],
  message: {
    type: String,
    default: '',
  },
  feedbackNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
