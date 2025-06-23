const Application = require('../models/application.model');
const sendEmailJob = require('../utils/sendEmailJob');
const Template = require('../models/template.model');

exports.sendMultiple = async (req, res) => {
  const userId = req.user.id;
  const { applications } = req.body;

  const results = [];

  for (let item of applications) {
    const {
      recipientEmail, company, role,
      jobDescription, templateId
    } = item;

    const template = await Template.findById(templateId);
    if (!template || template.status !== 'active') {
      results.push({ recipientEmail, status: 'failed', error: 'Invalid template' });
      continue;
    }

    const content = template.content
      .replace('{{company}}', company)
      .replace('{{role}}', role)
      .replace('{{description}}', jobDescription);

    const subject = `Application for ${role} at ${company}`;
    const emailResponse = await sendEmailJob({
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject,
      html: content
    });

    const appData = {
      user: userId,
      recipientEmail,
      company,
      role,
      jobDescription,
      emailTemplate: template.title,
      status: emailResponse.success ? 'sent' : 'failed',
      response: 'pending'
    };

    await Application.create(appData);

    results.push({ recipientEmail, status: appData.status });
  }

  res.status(200).json({ msg: 'Multi-send complete', results });
};
