/**
 * Global error handler middleware.
 * Maps GitHub API errors to appropriate HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  const status = err.response?.status;

  // GitHub: User not found
  if (status === 404) {
    return res.status(404).json({ message: 'GitHub user not found' });
  }

  // GitHub: Rate limit exceeded (403 with rate limit header, or 429)
  if (status === 403 || status === 429) {
    const rateLimitRemaining = err.response?.headers?.['x-ratelimit-remaining'];
    if (rateLimitRemaining === '0' || status === 429) {
      return res.status(429).json({ message: 'GitHub API rate limit exceeded' });
    }
    return res.status(403).json({ message: 'GitHub API access forbidden' });
  }

  // Generic internal server error
  console.error('[Error Handler]', err.message || err);
  return res.status(500).json({ message: 'Internal server error' });
};

module.exports = errorHandler;
