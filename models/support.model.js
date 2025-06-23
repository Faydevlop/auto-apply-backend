const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['refund', 'technical', 'suggestion', 'billing', 'other'] },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  attachment: {
    url: { type: String },
    public_id: { type: String },
  },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  replies: [
    {
      sender: { type: String, enum: ['user', 'admin'] },
      message: String,
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
