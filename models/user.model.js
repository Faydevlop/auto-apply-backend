const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  emailAppPassword: String,
   isVerified: { type: Boolean, default: false },
 resume: {
  type: String,
  default: ''
},
 resumePublicId: {
  type: String,
  default: ''
},
  otp: String,
  otpExpires: Date,
  
  plan: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Plan',
  default: null,
},
dailyUsage: {
  emailsSent: { type: Number, default: 0 },
  regenerations: { type: Number, default: 0 },
  resetAt: { type: Date, default: Date.now },
},
  preferences: {
    emailAlerts: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: true }
  },
  resumeText: {
  type: String,
  default: ''
},
  profileImage: {
    type: String,
    default: 'https://nmdfc.org/uploads/gallery/video/badgepng-cd449eedf7ca2d60e1875cf42dec68e3.png'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
