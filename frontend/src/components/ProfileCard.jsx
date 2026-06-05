import { motion } from 'framer-motion';
import {
  FiUsers, FiGitBranch, FiMapPin, FiLink, FiCalendar,
  FiTwitter, FiBriefcase, FiExternalLink
} from 'react-icons/fi';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  const joined = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6 glow-blue"
      id="profile-card"
    >
      {/* Avatar + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
        <div className="relative flex-shrink-0">
          <img
            src={profile.avatar_url}
            alt={`${profile.login}'s avatar`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-github-primary/50 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-github-success rounded-full border-2 border-github-bg" />
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-github-text">{profile.name}</h2>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-github-primary hover:underline text-sm font-mono"
          >
            @{profile.login}
          </a>
          {profile.bio && (
            <p className="text-github-muted text-sm mt-2 max-w-md">{profile.bio}</p>
          )}
        </div>

        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          id="profile-github-link"
          className="btn-ghost flex items-center gap-2 text-sm flex-shrink-0"
        >
          <FiExternalLink />
          View Profile
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-github-bg/50 rounded-xl border border-github-border/50">
        <div className="text-center">
          <div className="text-xl font-bold text-github-primary">
            {profile.followers.toLocaleString()}
          </div>
          <div className="text-github-muted text-xs mt-1 flex items-center justify-center gap-1">
            <FiUsers className="text-xs" /> Followers
          </div>
        </div>
        <div className="text-center border-x border-github-border/50">
          <div className="text-xl font-bold text-github-text">
            {profile.following.toLocaleString()}
          </div>
          <div className="text-github-muted text-xs mt-1 flex items-center justify-center gap-1">
            <FiUsers className="text-xs" /> Following
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-github-success">
            {profile.public_repos.toLocaleString()}
          </div>
          <div className="text-github-muted text-xs mt-1 flex items-center justify-center gap-1">
            <FiGitBranch className="text-xs" /> Repos
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-github-muted">
        {profile.company && (
          <span className="flex items-center gap-1.5">
            <FiBriefcase className="text-github-primary" />
            {profile.company}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center gap-1.5">
            <FiMapPin className="text-github-danger" />
            {profile.location}
          </span>
        )}
        {profile.blog && (
          <a
            href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-github-primary transition-colors"
          >
            <FiLink />
            {profile.blog.replace(/^https?:\/\//, '')}
          </a>
        )}
        {profile.twitter_username && (
          <a
            href={`https://twitter.com/${profile.twitter_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          >
            <FiTwitter />
            @{profile.twitter_username}
          </a>
        )}
        <span className="flex items-center gap-1.5">
          <FiCalendar className="text-github-accent" />
          Joined {joined}
        </span>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
