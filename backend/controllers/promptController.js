const Prompt = require('../models/Prompt');

const getPrompts = async (req, res) => {
  try {
    const userId = req.userId;
    const prompts = await Prompt.find({ userId }).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
};

const createPrompt = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, content, description } = req.body;
    const prompt = new Prompt({ userId, name, type, content });
    await prompt.save();
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
};

const updatePrompt = async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.userId;
    const { name, content } = req.body;
    const prompt = await Prompt.findOne({ _id: promptId, userId });
    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    
    prompt.name = name || prompt.name;
    prompt.content = content || prompt.content;
    await prompt.save();
    res.json(prompt);
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
};

const deletePrompt = async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.userId;
    await Prompt.findOneAndDelete({ _id: promptId, userId });
    res.json({ message: 'Prompt deleted' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
};

module.exports = { getPrompts, createPrompt, updatePrompt, deletePrompt };