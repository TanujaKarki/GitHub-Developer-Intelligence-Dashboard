import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const Pagination = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8" id="pagination-section">
      <motion.button
        onClick={onLoadMore}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-ghost flex items-center gap-2 px-8 py-3 min-w-[180px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        id="load-more-button"
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin" />
            Loading...
          </>
        ) : (
          'Load More Repositories'
        )}
      </motion.button>
    </div>
  );
};

export default Pagination;
