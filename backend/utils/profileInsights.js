/**
 * Developer Insights Engine
 * Computes analytics and insights from GitHub profile + repository data.
 */

/**
 * Calculate the number of days since a given ISO date string.
 * @param {string} dateStr
 * @returns {number}
 */
const daysSince = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
};

/**
 * Compute developer insights from repositories.
 * @param {Array} repos - Normalized repository objects
 * @returns {Object} insights
 */
const computeInsights = (repos) => {
  if (!repos || repos.length === 0) {
    return {
      totalStars: 0,
      topLanguage: 'N/A',
      mostPopularRepo: 'N/A',
      repositoryDiversity: 'Low',
      activityLevel: 'Inactive',
      suggestedImprovement: 'Start by creating public repositories to showcase your work.',
    };
  }

  // Total Stars
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  // Most Popular Repository (highest stars)
  const mostPopularRepo = repos.reduce(
    (best, r) => (r.stargazers_count > (best?.stargazers_count || 0) ? r : best),
    repos[0]
  );

  // Language frequency map
  const langMap = {};
  repos.forEach((r) => {
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  });

  const languageEntries = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
  const topLanguage = languageEntries.length > 0 ? languageEntries[0][0] : 'N/A';
  const uniqueLanguageCount = languageEntries.length;

  // Repository Diversity
  let repositoryDiversity;
  if (uniqueLanguageCount <= 2) repositoryDiversity = 'Low';
  else if (uniqueLanguageCount <= 4) repositoryDiversity = 'Medium';
  else repositoryDiversity = 'High';

  // Activity Level — based on the most recently updated repo
  const sortedByUpdate = [...repos].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );
  const mostRecentDays = daysSince(sortedByUpdate[0]?.updated_at || new Date().toISOString());

  let activityLevel;
  if (mostRecentDays <= 30) activityLevel = 'Very Active';
  else if (mostRecentDays <= 90) activityLevel = 'Moderately Active';
  else activityLevel = 'Inactive';

  // Rule-based Suggested Improvement
  const suggestedImprovement = generateSuggestion({
    topLanguage,
    repositoryDiversity,
    activityLevel,
    totalStars,
    uniqueLanguageCount,
    repoCount: repos.length,
  });

  return {
    totalStars,
    topLanguage,
    mostPopularRepo: mostPopularRepo?.name || 'N/A',
    repositoryDiversity,
    activityLevel,
    suggestedImprovement,
    languageBreakdown: languageEntries.map(([lang, count]) => ({
      name: lang,
      value: count,
      percentage: Math.round((count / repos.filter((r) => r.language).length) * 100),
    })),
  };
};

/**
 * Generate a rule-based improvement suggestion.
 */
const generateSuggestion = ({
  topLanguage,
  repositoryDiversity,
  activityLevel,
  totalStars,
  uniqueLanguageCount,
  repoCount,
}) => {
  if (activityLevel === 'Inactive') {
    return 'Your profile has been inactive for over 90 days. Consider contributing to open source or starting a new project to stay visible.';
  }

  if (repositoryDiversity === 'Low' && uniqueLanguageCount <= 1) {
    return `Strong ${topLanguage || 'coding'} focus detected. Consider exploring adjacent technologies to broaden your skill set and increase employability.`;
  }

  if (repositoryDiversity === 'Low') {
    return `Good start with ${uniqueLanguageCount} language(s). Consider diversifying into 3+ languages to showcase versatility to potential employers.`;
  }

  if (totalStars === 0 && repoCount > 5) {
    return 'You have several repositories but none have gained stars yet. Focus on polishing 1-2 key projects with solid READMEs and demos to attract attention.';
  }

  if (totalStars > 100 && repositoryDiversity === 'High') {
    return `Excellent profile! Strong ${topLanguage} background with high language diversity and community recognition. Consider writing technical blogs or contributing to major OSS projects.`;
  }

  if (repositoryDiversity === 'High') {
    return `Impressive language diversity! Your ${topLanguage} expertise combined with varied projects makes you a well-rounded developer. Consider adding more documentation to your top repos.`;
  }

  if (activityLevel === 'Very Active' && totalStars > 50) {
    return `Active developer with a growing community following. Keep it up! Consider creating project showcases or demo videos to maximize repository visibility.`;
  }

  return `Strong ${topLanguage} profile. Consider adding backend-focused or cross-domain repositories to diversify your skills and attract a broader audience.`;
};

module.exports = { computeInsights };
