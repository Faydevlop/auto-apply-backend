const axios = require('axios');

exports.enhanceEmailWithAI = async (text, tone = 'formal', improvements = '') => {
  const prompt = `
You are an expert email copywriter. Rewrite the following job application email in a ${tone} tone. 
Apply the following enhancements if provided: ${improvements || 'none'}

Email:
"""${text}"""
`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
};
