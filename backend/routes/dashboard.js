const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getDashboard, updateProgress } = require('../controllers/dashboardController');

router.get('/', authMiddleware, getDashboard);
router.post('/progress', authMiddleware, updateProgress);

module.exports = router;