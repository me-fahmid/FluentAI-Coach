const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streakCount: { type: Number, default: 0 },
  totalXP: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  chatSessions: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);