const Prompt = require('../models/Prompt');

const DEFAULT_PROMPTS = {
  'daily-plan': {
    name: 'Daily Plan Generator',
    content: `You are my personal language coach for English fluency. Create a highly structured daily immersion plan including:
- 20 phrases
- 15 vocabulary (grouped by theme)
- 5 grammar points with examples
- 3-minute speaking exercise
- end-of-day quiz
Make it engaging and simple.`
  },
  'conversation': {
    name: 'Conversation Partner',
    content: `Act as my English-speaking friend from New York. Keep conversation natural, use idioms, ask follow-up questions, correct mistakes gently by saying: 'That sounds good! Just one small thing...' and suggest better vocabulary.`
  },
  'roleplay': {
    name: 'Roleplay Scenarios',
    content: `I want to role-play real-life situations. You are a native English speaker. Speak naturally, use casual tone, correct awkward sentences by saying: 'Nice try! A native speaker would say...' and explain why.`
  },
  'writing': {
    name: 'Writing Assistant',
    content: `I will provide text. Rewrite it in: 1. Professional tone 2. Casual tone 3. Concise version. After each, explain improvements.`
  },
  'vocabulary': {
    name: 'Vocabulary Master',
    content: `Create a memory system for 5 advanced words with definitions, examples, mnemonics, and a quiz.`
  }
};

const getDefaultPrompt = (type) => {
  return DEFAULT_PROMPTS[type]?.content || '';
};

const initializeDefaultPrompts = async (userId) => {
  try {
    for (const [type, promptData] of Object.entries(DEFAULT_PROMPTS)) {
      const existingPrompt = await Prompt.findOne({ userId, type, isDefault: true });
      if (!existingPrompt) {
        await Prompt.create({
          userId,
          name: promptData.name,
          type,
          content: promptData.content,
          isDefault: true
        });
      }
    }
  } catch (error) {
    console.error('Error initializing prompts:', error);
  }
};

module.exports = { getDefaultPrompt, initializeDefaultPrompts };