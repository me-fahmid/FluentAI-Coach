const { generateAIResponse } = require('../utils/openaiService');
const { getDefaultPrompt } = require('../utils/promptManager');
const Prompt = require('../models/Prompt');
const Session = require('../models/Session');

const generateResponse = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, userInput, customPrompt } = req.body;
    
    let systemPrompt = customPrompt || getDefaultPrompt(type);
    
    if (!customPrompt) {
      const savedPrompt = await Prompt.findOne({ userId, type, isDefault: true });
      if (savedPrompt) systemPrompt = savedPrompt.content;
    }
    
    const aiResponse = await generateAIResponse(userInput, systemPrompt);
    
    const session = new Session({
      userId,
      type,
      content: { userInput, aiResponse }
    });
    
    await session.save();
    
    res.json({ response: aiResponse, sessionId: session._id });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
};

module.exports = { generateResponse };