const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  emailLimit: { type: Number, required: true },
  regenLimit: { type: Number, required: true },
  features: [String],
});

module.exports = mongoose.model('Plan', planSchema);
