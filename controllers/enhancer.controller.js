const { enhanceEmailWithAI } = require('../services/enhancer.service');

exports.enhanceEmail = async (req, res) => {
  const { emailText, tone, improvements } = req.body;

  if (!emailText) return res.status(400).json({ msg: 'Email text is required' });

  try {
    const result = await enhanceEmailWithAI(emailText, tone, improvements);
    res.status(200).json({ enhancedText: result });
  } catch (err) {
    res.status(500).json({ msg: 'Enhancement failed', error: err.message });
  }
};
