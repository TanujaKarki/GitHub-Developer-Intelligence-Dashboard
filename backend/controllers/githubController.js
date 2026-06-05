const { fetchUser, fetchRepos } = require('../services/githubService');
const { computeInsights } = require('../utils/profileInsights');
const { get, set, genKey } = require('../utils/cache');
const { DEFAULT_PER_PAGE } = require('../config');

/**
 * GET /api/github/:username
 * Fetch GitHub user profile + repos, with caching and insights.
 */
const getGitHubUser = async (req, res, next) => {
  const { username } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const per_page = parseInt(req.query.per_page, 10) || DEFAULT_PER_PAGE;

  const cacheKey = genKey(username, page);

  try {
    // Check cache
    const cached = get(cacheKey);
    if (cached) {
      return res.json({ ...cached, source: 'cache' });
    }

    // Fetch from GitHub in parallel
    const [profile, repos] = await Promise.all([
      fetchUser(username),
      fetchRepos(username, page, per_page),
    ]);

    // Compute insights (always from full dataset on page 1)
    // On subsequent pages, insights are recalculated from current page's repos
    const insights = computeInsights(repos);

    const responseData = {
      profile,
      repos,
      insights,
      pagination: {
        page,
        per_page,
        hasMore: repos.length === per_page,
      },
    };

    // Store in cache
    set(cacheKey, responseData);

    return res.json({ ...responseData, source: 'github' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGitHubUser };
