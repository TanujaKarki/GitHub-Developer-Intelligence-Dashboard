require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes/github');
const errorHandler = require('./middleware/errorHandler');
const { PORT } = require('./config');

const app = express();

// Security & utilities middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET'],
}));
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api', routes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GitHub Dashboard API ready`);
    console.log(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Configured ✓' : 'Missing ✗ (using unauthenticated)'}`);
  });
}

module.exports = app;
