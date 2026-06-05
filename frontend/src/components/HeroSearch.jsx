import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiX } from 'react-icons/fi';

const STORAGE_KEY = 'github_recent_searches';
const MAX_RECENT = 5;

const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveRecentSearch = (username) => {
  const searches = getRecentSearches().filter(
    (s) => s.toLowerCase() !== username.toLowerCase()
  );
  searches.unshift(username);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, MAX_RECENT)));
};

const HeroSearch = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => getRecentSearches());

  const handleSearch = (username) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    setRecentSearches(getRecentSearches());
    setInput(trimmed);
    onSearch(trimmed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(input);
  };

  const removeRecent = (e, username) => {
    e.stopPropagation();
    const updated = getRecentSearches().filter(
      (s) => s.toLowerCase() !== username.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden border-b border-github-border/40 bg-github-bg">
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-github-primary/10 border border-github-primary/20 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-github-success animate-pulse" />
          <span className="text-github-primary text-sm font-medium">Developer Intelligence Platform</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
        >
          <span className="text-gradient">GitHub Developer</span>
          <br />
          <span className="text-github-text">Intelligence Dashboard</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-github-muted text-lg mb-10 max-w-xl mx-auto"
        >
          Analyze GitHub developers, repositories, and coding trends with deep analytics and insights.
        </motion.p>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          id="search-form"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-github-muted text-lg" />
            <input
              id="username-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter GitHub username..."
              className="input-field w-full pl-12 pr-4"
              aria-label="GitHub username"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
          <button
            id="search-button"
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-github-bg/50 border-t-github-bg rounded-full animate-spin" />
                Searching
              </>
            ) : (
              <>
                <FiSearch />
                Search
              </>
            )}
          </button>
        </motion.form>

        {/* Recent Searches */}
        <AnimatePresence>
          {recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
              id="recent-searches"
              aria-label="Recently searched users"
            >
              <span className="flex items-center gap-1 text-github-muted text-xs">
                <FiClock className="text-sm" />
                Recent:
              </span>
              {recentSearches.map((username) => (
                <motion.div
                  key={username}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 bg-github-card border border-github-border rounded-full pl-3 pr-1 py-1 hover:border-github-primary/50 cursor-pointer transition-colors group"
                >
                  <button
                    onClick={() => handleSearch(username)}
                    className="text-github-muted text-xs group-hover:text-github-text transition-colors"
                    aria-label={`Search ${username} again`}
                  >
                    {username}
                  </button>
                  <button
                    onClick={(e) => removeRecent(e, username)}
                    className="p-1 rounded-full hover:bg-github-border/50 text-github-muted hover:text-github-danger transition-colors"
                    aria-label={`Remove ${username} from recent searches`}
                  >
                    <FiX className="text-xs" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSearch;
