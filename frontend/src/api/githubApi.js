import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Search a GitHub user and get profile, repos, and insights.
 * @param {string} username
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Object>}
 */
export const searchUser = async (username, page = 1, perPage = 30) => {
  const { data } = await api.get(`/github/${username}`, {
    params: { page, per_page: perPage },
  });
  return data;
};

export default api;
