import { render } from '@testing-library/react';
import {
  ProfileSkeleton,
  StatsSkeleton,
  ChartSkeleton,
  InsightsSkeleton,
  RepositoryListSkeleton,
} from '../components/SkeletonLoader';

describe('Skeleton Loader Components', () => {
  it('renders ProfileSkeleton without crashing', () => {
    const { container } = render(<ProfileSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders StatsSkeleton with 4 cards', () => {
    const { container } = render(<StatsSkeleton />);
    // The skeleton grid should have 4 card divs
    const cards = container.querySelectorAll('[id="skeleton-stats"] > div');
    expect(cards.length).toBe(4);
  });

  it('renders RepositoryListSkeleton with default 6 cards', () => {
    const { container } = render(<RepositoryListSkeleton />);
    const parent = container.querySelector('#skeleton-repos');
    expect(parent).toBeInTheDocument();
    expect(parent.children.length).toBe(6);
  });

  it('renders RepositoryListSkeleton with custom count', () => {
    const { container } = render(<RepositoryListSkeleton count={3} />);
    const parent = container.querySelector('#skeleton-repos');
    expect(parent.children.length).toBe(3);
  });

  it('renders ChartSkeleton', () => {
    render(<ChartSkeleton />);
    expect(document.getElementById('skeleton-chart')).toBeInTheDocument();
  });

  it('renders InsightsSkeleton', () => {
    render(<InsightsSkeleton />);
    expect(document.getElementById('skeleton-insights')).toBeInTheDocument();
  });
});
