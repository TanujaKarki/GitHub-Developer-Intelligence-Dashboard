const request = require('supertest');
const app = require('../server');

// Mock axios to avoid real network calls
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    defaults: { headers: { common: {} } },
  };
  return mockAxios;
});

// Mock cache to control cache behavior per test
jest.mock('../utils/cache', () => ({
  genKey: jest.fn((username, page) => `github:${username}:${page}`),
  get: jest.fn(),
  set: jest.fn(),
}));

const mockAxios = require('axios');
const cacheUtils = require('../utils/cache');

const mockProfile = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  bio: 'GitHub mascot',
  followers: 9000,
  following: 9,
  public_repos: 8,
  html_url: 'https://github.com/octocat',
  created_at: '2011-01-25T18:44:36Z',
  location: 'San Francisco, CA',
  blog: 'https://github.com/blog',
  company: '@github',
  twitter_username: 'monatheoctocat',
};

const mockRepos = [
  {
    name: 'Hello-World',
    description: 'My first repository on GitHub!',
    language: 'JavaScript',
    stargazers_count: 2,
    forks_count: 1765,
    updated_at: new Date().toISOString(),
    open_issues_count: 0,
    default_branch: 'master',
    watchers_count: 2,
    html_url: 'https://github.com/octocat/Hello-World',
    license: null,
    topics: [],
    fork: false,
    archived: false,
  },
  {
    name: 'Spoon-Knife',
    description: 'This repo is for demonstration purposes only.',
    language: 'HTML',
    stargazers_count: 12165,
    forks_count: 141657,
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    open_issues_count: 0,
    default_branch: 'main',
    watchers_count: 12165,
    html_url: 'https://github.com/octocat/Spoon-Knife',
    license: null,
    topics: [],
    fork: false,
    archived: false,
  },
];

// Simulate githubService responses via mocked axios
jest.mock('../services/githubService', () => ({
  fetchUser: jest.fn(),
  fetchRepos: jest.fn(),
}));

const { fetchUser, fetchRepos } = require('../services/githubService');

beforeEach(() => {
  jest.clearAllMocks();
  cacheUtils.get.mockReturnValue(undefined); // Default: cache miss
});

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// Profile Fetch Success
// ─────────────────────────────────────────────
describe('GET /api/github/:username - success', () => {
  it('should return profile, repos, insights, and source:github on cache miss', async () => {
    fetchUser.mockResolvedValueOnce(mockProfile);
    fetchRepos.mockResolvedValueOnce(mockRepos);

    const res = await request(app).get('/api/github/octocat');

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('github');
    expect(res.body.profile).toMatchObject({ login: 'octocat' });
    expect(Array.isArray(res.body.repos)).toBe(true);
    expect(res.body.repos.length).toBe(2);
    expect(res.body.insights).toBeDefined();
    expect(res.body.insights.totalStars).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it('should store response in cache after github fetch', async () => {
    fetchUser.mockResolvedValueOnce(mockProfile);
    fetchRepos.mockResolvedValueOnce(mockRepos);

    await request(app).get('/api/github/octocat');

    expect(cacheUtils.set).toHaveBeenCalledWith(
      'github:octocat:1',
      expect.objectContaining({ profile: expect.any(Object) })
    );
  });
});

// ─────────────────────────────────────────────
// Cache Hit
// ─────────────────────────────────────────────
describe('GET /api/github/:username - cache hit', () => {
  it('should return source:cache when cache is populated', async () => {
    const cachedData = {
      profile: mockProfile,
      repos: mockRepos,
      insights: { totalStars: 12167 },
      pagination: { page: 1, per_page: 30, hasMore: false },
    };
    cacheUtils.get.mockReturnValueOnce(cachedData);

    const res = await request(app).get('/api/github/octocat');

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('cache');
    expect(fetchUser).not.toHaveBeenCalled();
    expect(fetchRepos).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// User Not Found (404)
// ─────────────────────────────────────────────
describe('GET /api/github/:username - user not found', () => {
  it('should return 404 when GitHub returns 404', async () => {
    const error = new Error('Not Found');
    error.response = { status: 404 };
    fetchUser.mockRejectedValueOnce(error);
    fetchRepos.mockRejectedValueOnce(error);

    const res = await request(app).get('/api/github/thisuserdoesnotexist99999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('GitHub user not found');
  });
});

// ─────────────────────────────────────────────
// Rate Limit (429)
// ─────────────────────────────────────────────
describe('GET /api/github/:username - rate limit', () => {
  it('should return 429 when GitHub rate limit is exceeded', async () => {
    const error = new Error('Rate limit exceeded');
    error.response = {
      status: 403,
      headers: { 'x-ratelimit-remaining': '0' },
    };
    fetchUser.mockRejectedValueOnce(error);
    fetchRepos.mockRejectedValueOnce(error);

    const res = await request(app).get('/api/github/octocat');

    expect(res.status).toBe(429);
    expect(res.body.message).toBe('GitHub API rate limit exceeded');
  });

  it('should return 429 on status 429', async () => {
    const error = new Error('Too Many Requests');
    error.response = { status: 429, headers: {} };
    fetchUser.mockRejectedValueOnce(error);
    fetchRepos.mockRejectedValueOnce(error);

    const res = await request(app).get('/api/github/octocat');

    expect(res.status).toBe(429);
    expect(res.body.message).toBe('GitHub API rate limit exceeded');
  });
});

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────
describe('GET /api/github/:username - pagination', () => {
  it('should pass correct page params to service', async () => {
    fetchUser.mockResolvedValueOnce(mockProfile);
    fetchRepos.mockResolvedValueOnce([]);

    await request(app).get('/api/github/octocat?page=2&per_page=10');

    expect(fetchRepos).toHaveBeenCalledWith('octocat', 2, 10);
  });
});
