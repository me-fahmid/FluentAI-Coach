const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateResponse } = require('../controllers/aiController');

router.post('/send', authMiddleware, async (req, res) => {
  req.body.type = 'conversation';
  await generateResponse(req, res);
});

module.exports = router;