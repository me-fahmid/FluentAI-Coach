const Progress = require('../models/Progress');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await Progress.findOne({ userId });
    const user = await User.findById(userId);
    
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    
    res.json({
      user: { name: user.name, proficiency: user.proficiency, email: user.email },
      progress: {
        streakCount: progress.streakCount,
        totalXP: progress.totalXP,
        lessonsCompleted: progress.lessonsCompleted,
        chatSessions: progress.chatSessions,
        lastActivityDate: progress.lastActivityDate
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, xpEarned } = req.body;
    const progress = await Progress.findOne({ userId });
    
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    
    progress.totalXP += xpEarned || 10;
    if (type === 'chat') progress.chatSessions += 1;
    
    progress.lastActivityDate = new Date();
    await progress.save();
    
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

module.exports = { getDashboard, updateProgress };