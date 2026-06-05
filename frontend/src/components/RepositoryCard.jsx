import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiGitBranch, FiAlertCircle, FiEye, FiExternalLink,
  FiChevronDown, FiChevronUp, FiClock, FiTag
} from 'react-icons/fi';

// Language badge colors
const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  Go: '#00ADD8',
  Rust: '#FF4647',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  'C++': '#F34B7D',
  C: '#555555',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Vue: '#42B883',
  Dart: '#0175C2',
  default: '#8B949E',
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const RepositoryCard = ({ repo, index }) => {
  const [expanded, setExpanded] = useState(false);

  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="card hover:border-github-primary/30 transition-all duration-300"
      id={`repo-card-${repo.name}`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-github-primary hover:underline truncate max-w-[200px] sm:max-w-none"
              >
                {repo.name}
              </a>
              {repo.fork && (
                <span className="badge bg-github-bg border border-github-border text-github-muted text-[10px]">
                  Fork
                </span>
              )}
              {repo.archived && (
                <span className="badge bg-github-warning/10 border border-github-warning/30 text-github-warning text-[10px]">
                  Archived
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-github-muted text-sm mt-1 line-clamp-2">{repo.description}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="badge bg-github-primary/10 border border-github-primary/20 text-github-primary text-[10px] flex items-center gap-1"
              >
                <FiTag className="text-[9px]" />
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-github-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiStar className="text-yellow-400" />
            {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <FiGitBranch />
            {repo.forks_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <FiClock />
            {timeAgo(repo.updated_at)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
            id={`repo-view-${repo.name}`}
          >
            <FiExternalLink className="text-xs" />
            View on GitHub
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 ml-auto"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'View Details'}
            id={`repo-toggle-${repo.name}`}
          >
            View Details
            {expanded ? <FiChevronUp className="text-xs" /> : <FiChevronDown className="text-xs" />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-github-border/50 p-4 sm:p-5 bg-github-bg/30">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-github-muted text-xs mb-1 flex items-center gap-1">
                    <FiAlertCircle className="text-github-danger" /> Open Issues
                  </p>
                  <p className="font-semibold text-github-text">
                    {repo.open_issues_count.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-github-muted text-xs mb-1 flex items-center gap-1">
                    <FiEye className="text-github-primary" /> Watchers
                  </p>
                  <p className="font-semibold text-github-text">
                    {repo.watchers_count.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-github-muted text-xs mb-1 flex items-center gap-1">
                    <FiGitBranch className="text-github-success" /> Default Branch
                  </p>
                  <p className="font-semibold text-github-text font-mono">
                    {repo.default_branch}
                  </p>
                </div>
                <div>
                  <p className="text-github-muted text-xs mb-1 flex items-center gap-1">
                    <FiStar className="text-yellow-400" /> Forks
                  </p>
                  <p className="font-semibold text-github-text">
                    {repo.forks_count.toLocaleString()}
                  </p>
                </div>
                {repo.license && (
                  <div>
                    <p className="text-github-muted text-xs mb-1">License</p>
                    <p className="font-semibold text-github-text">{repo.license}</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-github-muted text-xs mb-1">Repository URL</p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-github-primary text-xs hover:underline break-all"
                  >
                    {repo.html_url}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RepositoryCard;
