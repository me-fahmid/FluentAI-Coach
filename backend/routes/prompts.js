const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getPrompts, createPrompt, updatePrompt, deletePrompt } = require('../controllers/promptController');

router.get('/', authMiddleware, getPrompts);
router.post('/', authMiddleware, createPrompt);
router.put('/:promptId', authMiddleware, updatePrompt);
router.delete('/:promptId', authMiddleware, deletePrompt);

module.exports = router;