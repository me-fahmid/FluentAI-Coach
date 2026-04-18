const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateResponse } = require('../controllers/aiController');

router.post('/quiz', authMiddleware, async (req, res) => {
  req.body.type = 'vocabulary';
  await generateResponse(req, res);
});

module.exports = router;