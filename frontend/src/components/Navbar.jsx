import { FiGithub } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-github-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-9 h-9 bg-github-primary/20 rounded-lg flex items-center justify-center border border-github-primary/30">
              <FiGithub className="text-github-primary text-xl" />
            </div>
            <div>
              <span className="font-bold text-github-text text-sm sm:text-base leading-tight block">
                Dev Intelligence
              </span>
              <span className="text-github-muted text-xs hidden sm:block">
                GitHub Analytics Dashboard
              </span>
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              id="navbar-github-link"
              className="flex items-center gap-2 text-github-muted hover:text-github-primary transition-colors text-sm font-medium"
            >
              <FiGithub className="text-lg" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
