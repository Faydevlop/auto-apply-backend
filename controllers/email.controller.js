// controllers/email.controller.js
const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');

exports.sendJobApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Enforce daily email limit
    if (req.limits.usage.emailsSent >= req.limits.emailLimit) {
      return res.status(429).json({ msg: 'Email sending limit reached for today' });
    }

    // Do your email generation and sending here
    const { recipientEmail, subject, content } = req.body;
    await sendEmail(recipientEmail, subject, content);

    // Increment usage
    user.dailyUsage.emailsSent += 1;
    await user.save();

    res.status(200).json({ msg: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Email send failed', error: err.message });
  }
};
