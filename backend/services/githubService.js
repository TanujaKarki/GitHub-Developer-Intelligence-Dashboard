const axios = require('axios');
const { GITHUB_TOKEN, GITHUB_API_BASE } = require('../config');

/**
 * Build Axios instance with GitHub authorization header.
 */
const githubAxios = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
  timeout: 10000,
});

/**
 * Fetch a GitHub user profile and normalize the response.
 * @param {string} username
 * @returns {Promise<Object>} Normalized profile
 */
const fetchUser = async (username) => {
  const { data } = await githubAxios.get(`/users/${username}`);
  return {
    login: data.login,
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    bio: data.bio || '',
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
    html_url: data.html_url,
    created_at: data.created_at,
    location: data.location || '',
    blog: data.blog || '',
    company: data.company || '',
    twitter_username: data.twitter_username || '',
  };
};

/**
 * Fetch paginated repositories for a GitHub user and normalize.
 * @param {string} username
 * @param {number} page
 * @param {number} per_page
 * @returns {Promise<Array>} Normalized repository list
 */
const fetchRepos = async (username, page = 1, per_page = 30) => {
  const { data } = await githubAxios.get(`/users/${username}/repos`, {
    params: {
      page,
      per_page,
      sort: 'updated',
      direction: 'desc',
    },
  });

  return data.map((repo) => ({
    name: repo.name,
    description: repo.description || '',
    language: repo.language || null,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    updated_at: repo.updated_at,
    open_issues_count: repo.open_issues_count,
    default_branch: repo.default_branch,
    watchers_count: repo.watchers_count,
    html_url: repo.html_url,
    license: repo.license ? repo.license.spdx_id : null,
    topics: repo.topics || [],
    fork: repo.fork,
    archived: repo.archived,
  }));
};

module.exports = { fetchUser, fetchRepos };
