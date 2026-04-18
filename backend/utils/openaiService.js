const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAIResponse = async (prompt, systemMessage = '') => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage || 'You are a helpful English learning assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

module.exports = { generateAIResponse };