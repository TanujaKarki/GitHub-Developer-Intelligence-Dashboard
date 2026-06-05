import { FiGithub, FiHeart } from 'react-icons/fi';

const Footer = () => (
  <footer className="border-t border-github-border mt-20 py-10" id="footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-github-muted text-sm">
          <FiGithub className="text-github-primary" />
          <span>GitHub Developer Intelligence Dashboard</span>
        </div>
        <div className="flex items-center gap-1.5 text-github-muted text-sm">
          Built with <FiHeart className="text-github-danger" /> using React & Node.js
        </div>
        <div className="text-github-muted text-xs">
          Data sourced from the{' '}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-github-primary hover:underline"
          >
            GitHub REST API
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
