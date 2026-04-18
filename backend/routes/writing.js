const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateResponse } = require('../controllers/aiController');

router.post('/analyze', authMiddleware, async (req, res) => {
  req.body.type = 'writing';
  await generateResponse(req, res);
});

module.exports = router;