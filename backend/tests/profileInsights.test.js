const { computeInsights } = require('../utils/profileInsights');

describe('profileInsights - computeInsights', () => {
  it('returns default insights for empty repos array', () => {
    const result = computeInsights([]);
    expect(result.totalStars).toBe(0);
    expect(result.topLanguage).toBe('N/A');
    expect(result.repositoryDiversity).toBe('Low');
    expect(result.activityLevel).toBe('Inactive');
    expect(result.suggestedImprovement).toContain('public repositories');
  });

  it('returns default insights for null repos', () => {
    const result = computeInsights(null);
    expect(result.totalStars).toBe(0);
    expect(result.topLanguage).toBe('N/A');
  });

  it('calculates total stars correctly', () => {
    const repos = [
      { stargazers_count: 10, language: 'JavaScript', updated_at: new Date().toISOString() },
      { stargazers_count: 25, language: 'Python', updated_at: new Date().toISOString() },
      { stargazers_count: 5, language: 'Go', updated_at: new Date().toISOString() },
    ];
    const result = computeInsights(repos);
    expect(result.totalStars).toBe(40);
  });

  it('identifies the most popular repo', () => {
    const repos = [
      { name: 'small-repo', stargazers_count: 2, language: 'JavaScript', updated_at: new Date().toISOString() },
      { name: 'popular-repo', stargazers_count: 500, language: 'TypeScript', updated_at: new Date().toISOString() },
      { name: 'medium-repo', stargazers_count: 50, language: 'Python', updated_at: new Date().toISOString() },
    ];
    const result = computeInsights(repos);
    expect(result.mostPopularRepo).toBe('popular-repo');
  });

  it('determines repositoryDiversity = Low for 1-2 languages', () => {
    const repos = [
      { name: 'a', stargazers_count: 1, language: 'JavaScript', updated_at: new Date().toISOString() },
      { name: 'b', stargazers_count: 1, language: 'JavaScript', updated_at: new Date().toISOString() },
    ];
    expect(computeInsights(repos).repositoryDiversity).toBe('Low');
  });

  it('determines repositoryDiversity = Medium for 3-4 languages', () => {
    const makeRepo = (lang) => ({
      name: lang, stargazers_count: 1, language: lang, updated_at: new Date().toISOString()
    });
    const repos = ['JS', 'TS', 'Python', 'Go'].map(makeRepo);
    expect(computeInsights(repos).repositoryDiversity).toBe('Medium');
  });

  it('determines repositoryDiversity = High for 5+ languages', () => {
    const makeRepo = (lang) => ({
      name: lang, stargazers_count: 1, language: lang, updated_at: new Date().toISOString()
    });
    const repos = ['JS', 'TS', 'Python', 'Go', 'Rust', 'C++'].map(makeRepo);
    expect(computeInsights(repos).repositoryDiversity).toBe('High');
  });

  it('determines activityLevel = Very Active for update within 30 days', () => {
    const repos = [
      { name: 'a', stargazers_count: 1, language: 'JS', updated_at: new Date().toISOString() }
    ];
    expect(computeInsights(repos).activityLevel).toBe('Very Active');
  });

  it('determines activityLevel = Moderately Active for update 31-90 days ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const repos = [{ name: 'a', stargazers_count: 1, language: 'JS', updated_at: date }];
    expect(computeInsights(repos).activityLevel).toBe('Moderately Active');
  });

  it('determines activityLevel = Inactive for update 90+ days ago', () => {
    const date = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString();
    const repos = [{ name: 'a', stargazers_count: 1, language: 'JS', updated_at: date }];
    expect(computeInsights(repos).activityLevel).toBe('Inactive');
  });

  it('handles repos with null language', () => {
    const repos = [
      { name: 'a', stargazers_count: 5, language: null, updated_at: new Date().toISOString() },
      { name: 'b', stargazers_count: 3, language: null, updated_at: new Date().toISOString() },
    ];
    const result = computeInsights(repos);
    expect(result.topLanguage).toBe('N/A');
    expect(result.languageBreakdown).toHaveLength(0);
  });

  it('generates a language breakdown array', () => {
    const repos = [
      { name: 'a', stargazers_count: 1, language: 'JavaScript', updated_at: new Date().toISOString() },
      { name: 'b', stargazers_count: 1, language: 'JavaScript', updated_at: new Date().toISOString() },
      { name: 'c', stargazers_count: 1, language: 'Python', updated_at: new Date().toISOString() },
    ];
    const result = computeInsights(repos);
    const jsEntry = result.languageBreakdown.find((l) => l.name === 'JavaScript');
    const pyEntry = result.languageBreakdown.find((l) => l.name === 'Python');
    expect(jsEntry.value).toBe(2);
    expect(pyEntry.value).toBe(1);
  });
});
