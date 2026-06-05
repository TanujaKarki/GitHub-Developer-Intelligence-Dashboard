import { motion } from 'framer-motion';
import {
  FiStar, FiCode, FiTrendingUp, FiActivity,
  FiAward, FiZap, FiGitBranch
} from 'react-icons/fi';

const diversityColors = {
  Low: 'text-github-danger',
  Medium: 'text-github-warning',
  High: 'text-github-success',
};

const activityColors = {
  'Very Active': 'text-github-success bg-github-success/10 border-github-success/30',
  'Moderately Active': 'text-github-warning bg-github-warning/10 border-github-warning/30',
  'Inactive': 'text-github-muted bg-github-bg border-github-border',
};

const InsightRow = ({ icon, label, value, valueClass = '' }) => (
  <div className="flex items-center justify-between py-3 border-b border-github-border/50 last:border-0">
    <div className="flex items-center gap-2.5 text-github-muted text-sm">
      <span className="text-github-primary">{icon}</span>
      {label}
    </div>
    <span className={`font-semibold text-sm text-github-text ${valueClass}`}>{value}</span>
  </div>
);

const InsightsPanel = ({ insights }) => {
  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-6"
      id="insights-panel"
    >
      <h3 className="section-title">
        <FiTrendingUp className="text-github-accent" />
        Developer Insights
      </h3>

      <div className="mb-5">
        <InsightRow
          icon={<FiStar />}
          label="Total Stars Earned"
          value={insights.totalStars?.toLocaleString() || 0}
        />
        <InsightRow
          icon={<FiCode />}
          label="Top Language"
          value={insights.topLanguage || 'N/A'}
          valueClass="text-github-primary font-mono"
        />
        <InsightRow
          icon={<FiAward />}
          label="Most Popular Repo"
          value={insights.mostPopularRepo || 'N/A'}
          valueClass="text-github-primary"
        />
        <div className="flex items-center justify-between py-3 border-b border-github-border/50">
          <div className="flex items-center gap-2.5 text-github-muted text-sm">
            <span className="text-github-primary"><FiGitBranch /></span>
            Repository Diversity
          </div>
          <span className={`font-semibold text-sm ${diversityColors[insights.repositoryDiversity] || 'text-github-text'}`}>
            {insights.repositoryDiversity || '–'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-github-border/50 last:border-0">
          <div className="flex items-center gap-2.5 text-github-muted text-sm">
            <span className="text-github-primary"><FiActivity /></span>
            Activity Level
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${activityColors[insights.activityLevel] || 'text-github-muted'}`}>
            {insights.activityLevel || '–'}
          </span>
        </div>
      </div>

      {/* Suggested Improvement */}
      {insights.suggestedImprovement && (
        <div className="p-4 bg-github-primary/5 border border-github-primary/20 rounded-xl">
          <div className="flex items-start gap-2.5">
            <FiZap className="text-github-primary text-lg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-github-primary text-xs font-semibold uppercase tracking-wide mb-1">
                Suggested Improvement
              </p>
              <p className="text-github-muted text-sm leading-relaxed">
                {insights.suggestedImprovement}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InsightsPanel;
