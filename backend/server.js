const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();

// ✅ CORS FIX (IMPORTANT)
const allowedOrigins = [
  'http://localhost:3000',
  'https://fluentai-coach.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

// ✅ Preflight fix
app.options('*', cors());

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection FIX
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/daily-plan', require('./routes/dailyPlan'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/roleplay', require('./routes/roleplay'));
app.use('/api/writing', require('./routes/writing'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/prompts', require('./routes/prompts'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
