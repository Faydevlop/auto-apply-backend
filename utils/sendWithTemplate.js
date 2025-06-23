const sendEmail = require('./sendEmail');

module.exports = async (to, templateText, data) => {
  let content = templateText
    .replace(/\{\{role\}\}/g, data.role)
    .replace(/\{\{company\}\}/g, data.company)
    .replace(/\{\{description\}\}/g, data.description);

  await sendEmail(to, `Application for ${data.role}`, content);
};
