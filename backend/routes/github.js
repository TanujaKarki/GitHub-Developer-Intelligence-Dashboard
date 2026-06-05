const express = require('express');
const { getGitHubUser } = require('../controllers/githubController');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GitHub user data
router.get('/github/:username', getGitHubUser);

module.exports = router;
