import { FiSearch, FiChevronDown } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'stars', label: '⭐ Stars' },
  { value: 'name', label: '🔤 Name (A-Z)' },
  { value: 'updated', label: '🕐 Last Updated' },
];

const RepositoryControls = ({ search, onSearch, sortBy, onSortChange }) => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-3"
      id="repository-controls"
      role="group"
      aria-label="Repository filters and sort"
    >
      {/* Search Filter */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-github-muted text-base" />
        <input
          id="repo-search-input"
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Filter repositories..."
          className="input-field w-full pl-10 py-2.5 text-sm"
          aria-label="Filter repositories by name"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative min-w-[160px]">
        <select
          id="repo-sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field w-full py-2.5 text-sm appearance-none pr-9 cursor-pointer"
          aria-label="Sort repositories"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-github-card">
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-github-muted pointer-events-none" />
      </div>
    </div>
  );
};

export default RepositoryControls;
