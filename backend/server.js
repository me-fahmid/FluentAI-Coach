const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ MongoDB error:', err.message));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/daily-plan', require('./routes/dailyPlan'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/roleplay', require('./routes/roleplay'));
app.use('/api/writing', require('./routes/writing'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/prompts', require('./routes/prompts'));

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});