const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: String,
  role: String,
  recipientEmail: String,
  jobDescription: String,
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  responseStatus: {
    type: String,
    enum: ['none', 'interview', 'rejected', 'pending'],
    default: 'pending',
  },
  sentAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
