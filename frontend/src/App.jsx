import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiAlertTriangle, FiWifiOff, FiGitBranch } from 'react-icons/fi';
import { searchUser } from './api/githubApi';

import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import ProfileCard from './components/ProfileCard';
import StatsCards from './components/StatsCards';
import LanguageChart from './components/LanguageChart';
import InsightsPanel from './components/InsightsPanel';
import RepositoryControls from './components/RepositoryControls';
import RepositoryCard from './components/RepositoryCard';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import {
  ProfileSkeleton,
  StatsSkeleton,
  ChartSkeleton,
  InsightsSkeleton,
  RepositoryListSkeleton,
} from './components/SkeletonLoader';

// Error message component
const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card border-github-danger/30 p-8 text-center max-w-md mx-auto"
    id="error-message"
    role="alert"
  >
    <div className="w-14 h-14 bg-github-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
      {message?.toLowerCase().includes('rate limit') ? (
        <FiWifiOff className="text-github-warning text-2xl" />
      ) : message?.toLowerCase().includes('not found') ? (
        <FiGitBranch className="text-github-danger text-2xl" />
      ) : (
        <FiAlertTriangle className="text-github-danger text-2xl" />
      )}
    </div>
    <h3 className="text-github-text font-semibold text-lg mb-2">
      {message?.toLowerCase().includes('not found') ? 'User Not Found' :
       message?.toLowerCase().includes('rate limit') ? 'Rate Limit Exceeded' :
       'Something Went Wrong'}
    </h3>
    <p className="text-github-muted text-sm">{message}</p>
  </motion.div>
);

// Cache source badge
const CacheBadge = ({ source }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
    source === 'cache'
      ? 'text-github-success border-github-success/30 bg-github-success/10'
      : 'text-github-primary border-github-primary/30 bg-github-primary/10'
  }`}>
    {source === 'cache' ? 'Cached' : 'Live'}
  </span>
);

function App() {
  const [activeUsername, setActiveUsername] = useState(null);
  const [repoFilter, setRepoFilter] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [page, setPage] = useState(1);
  const [allRepos, setAllRepos] = useState([]);
  const [hasMoreRepos, setHasMoreRepos] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Primary query (page 1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['github', activeUsername, 1],
    queryFn: () => searchUser(activeUsername, 1),
    enabled: Boolean(activeUsername),
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      const msg = err?.message || '';
      if (msg.includes('not found') || msg.includes('rate limit')) return false;
      return failureCount < 2;
    },
  });

  const handleSearch = useCallback((username) => {
    setActiveUsername(username);
    setRepoFilter('');
    setSortBy('updated');
    setPage(1);
    setAllRepos([]);
    setHasMoreRepos(false);
  }, []);

  // Load more repos (appending)
  const handleLoadMore = useCallback(async () => {
    if (!activeUsername) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const result = await searchUser(activeUsername, nextPage);
      if (result?.repos) {
        setAllRepos((prev) => {
          const currentRepos = prev.length > 0 ? prev : (data?.repos || []);
          const existingNames = new Set(currentRepos.map((r) => r.name));
          const newRepos = result.repos.filter((r) => !existingNames.has(r.name));
          return [...currentRepos, ...newRepos];
        });
        setPage(nextPage);
        setHasMoreRepos(Boolean(result.pagination?.hasMore));
      }
    } catch {
      // silently fail load more
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeUsername, data?.repos, page]);

  // Derived: filtered + sorted repos
  const filteredRepos = useMemo(() => {
    let repos = allRepos.length > 0 ? allRepos : (data?.repos || []);

    if (repoFilter) {
      repos = repos.filter((r) =>
        r.name.toLowerCase().includes(repoFilter.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(repoFilter.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'stars':
        return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
      case 'name':
        return [...repos].sort((a, b) => a.name.localeCompare(b.name));
      case 'updated':
      default:
        return [...repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
  }, [allRepos, data?.repos, repoFilter, sortBy]);

  const hasMore = !repoFilter && (page === 1 ? data?.pagination?.hasMore : hasMoreRepos);
  const repoCount = (allRepos.length > 0 ? allRepos : data?.repos || []).length;

  return (
    <div className="min-h-screen bg-github-bg">
      <Navbar />

      <main>
        {/* Hero Search Section */}
        <HeroSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {activeUsername && (
            <motion.div
              key={activeUsername}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10"
            >
              {/* Cache source indicator */}
              {data?.source && !isLoading && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-github-muted text-sm">
                    Results for{' '}
                    <span className="text-github-primary font-mono">@{activeUsername}</span>
                  </h2>
                  <CacheBadge source={data.source} />
                </div>
              )}

              {/* Error State */}
              {isError && <ErrorMessage message={error?.message} />}

              {/* Loading State */}
              {isLoading && !isError && (
                <div className="space-y-6">
                  <ProfileSkeleton />
                  <StatsSkeleton />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <InsightsSkeleton />
                  </div>
                  <RepositoryListSkeleton />
                </div>
              )}

              {/* Success State */}
              {!isLoading && !isError && data && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <ProfileCard profile={data.profile} />

                  {/* Stats Cards */}
                  <StatsCards profile={data.profile} insights={data.insights} />

                  {/* Charts + Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LanguageChart languageBreakdown={data.insights?.languageBreakdown} />
                    <InsightsPanel insights={data.insights} />
                  </div>

                  {/* Repository Section */}
                  <div className="card p-6" id="repositories-section">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <h3 className="section-title mb-0">
                        <FiGitBranch className="text-github-success" />
                        Repositories
                        <span className="text-github-muted text-sm font-normal ml-1">
                          ({repoCount} loaded)
                        </span>
                      </h3>
                    </div>

                    <div className="mb-5">
                      <RepositoryControls
                        search={repoFilter}
                        onSearch={setRepoFilter}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                      />
                    </div>

                    {filteredRepos.length === 0 ? (
                      <div className="text-center py-12 text-github-muted" id="no-repos-message">
                        <FiGitBranch className="text-4xl mx-auto mb-3 opacity-30" />
                        <p>No repositories match your filter.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredRepos.map((repo, index) => (
                          <RepositoryCard key={repo.name} repo={repo} index={index} />
                        ))}
                      </div>
                    )}

                    <Pagination
                      hasMore={hasMore}
                      onLoadMore={handleLoadMore}
                      isLoading={isLoadingMore}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
