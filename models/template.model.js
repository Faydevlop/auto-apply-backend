const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['active', 'pending', 'rejected'], default: 'active' },
  type: { type: String, enum: ['default', 'custom'], default: 'default' },
  createdBy: { type: String, default: 'System' },
  usageCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
