import { useQuery } from '@tanstack/react-query';
import { searchUser } from '../api/githubApi';

/**
 * TanStack Query hook for fetching GitHub user data.
 * @param {string|null} username
 * @param {number} page
 * @returns {object} query state
 */
const useGitHubData = (username, page = 1) => {
  return useQuery({
    queryKey: ['github', username, page],
    queryFn: () => searchUser(username, page),
    enabled: Boolean(username && username.trim()),
    staleTime: 60 * 1000, // 60 seconds (matches server cache TTL)
    retry: (failureCount, error) => {
      // Don't retry on 404 or 429
      const msg = error?.message || '';
      if (msg.includes('not found') || msg.includes('rate limit')) return false;
      return failureCount < 2;
    },
  });
};

export default useGitHubData;
