import { motion } from 'framer-motion';
import { FiStar, FiFolder, FiCode, FiZap } from 'react-icons/fi';

const activityColors = {
  'Very Active': 'text-github-success border-github-success/30 bg-github-success/10',
  'Moderately Active': 'text-github-warning border-github-warning/30 bg-github-warning/10',
  'Inactive': 'text-github-muted border-github-border bg-github-bg/50',
};

const cards = (profile, insights) => [
  {
    id: 'stat-total-stars',
    icon: <FiStar className="text-yellow-400 text-2xl" />,
    label: 'Total Stars',
    value: (insights?.totalStars ?? 0).toLocaleString(),
    color: 'border-yellow-500/20 hover:border-yellow-400/40',
    bg: 'bg-yellow-500/5',
  },
  {
    id: 'stat-repos',
    icon: <FiFolder className="text-github-primary text-2xl" />,
    label: 'Repositories',
    value: (profile?.public_repos ?? 0).toLocaleString(),
    color: 'border-github-primary/20 hover:border-github-primary/50',
    bg: 'bg-github-primary/5',
  },
  {
    id: 'stat-languages',
    icon: <FiCode className="text-github-accent text-2xl" />,
    label: 'Languages Used',
    value: insights?.languageBreakdown?.length
      ? `${insights.languageBreakdown.length} lang${insights.languageBreakdown.length > 1 ? 's' : ''}`
      : '–',
    color: 'border-purple-500/20 hover:border-purple-400/40',
    bg: 'bg-purple-500/5',
  },
  {
    id: 'stat-activity',
    icon: <FiZap className={`text-2xl ${activityColors[insights?.activityLevel]?.split(' ')[0] || 'text-github-muted'}`} />,
    label: 'Activity Level',
    value: insights?.activityLevel || '–',
    color: 'border-github-success/20 hover:border-github-success/40',
    bg: 'bg-github-success/5',
    isActivity: true,
    activityLevel: insights?.activityLevel,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const StatsCards = ({ profile, insights }) => {
  const statCards = cards(profile, insights);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      id="stats-cards"
    >
      {statCards.map((card) => (
        <motion.div
          key={card.id}
          id={card.id}
          variants={itemVariants}
          className={`card p-5 border-2 ${card.color} ${card.bg} transition-all duration-300`}
        >
          <div className="mb-3">{card.icon}</div>
          <div className="text-2xl font-bold text-github-text mb-1">
            {card.isActivity && card.activityLevel ? (
              <span className={activityColors[card.activityLevel]?.split(' ')[0]}>
                {card.value}
              </span>
            ) : (
              card.value
            )}
          </div>
          <div className="text-github-muted text-xs font-medium uppercase tracking-wide">
            {card.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
