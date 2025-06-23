const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('plan');
    const now = new Date();

    // Reset daily usage if reset time passed
    if (!user.dailyUsage.resetAt || user.dailyUsage.resetAt < now) {
      user.dailyUsage = {
        emailsSent: 0,
        regenerations: 0,
        resetAt: new Date(now.setHours(24, 0, 0, 0))
      };
      await user.save();
    }

    // Attach limits to request
    req.limits = {
      emailLimit: user.plan?.emailLimit || 20,
      regenLimit: user.plan?.regenLimit || 20,
      usage: user.dailyUsage
    };

    next();
  } catch (err) {
    res.status(500).json({ msg: 'Rate check failed', error: err.message });
  }
};
