const SkeletonBox = ({ className }) => (
  <div className={`shimmer rounded-lg ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="card p-6" id="skeleton-profile">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
      <SkeletonBox className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0" />
      <div className="flex-1 w-full">
        <SkeletonBox className="h-6 w-48 mb-2" />
        <SkeletonBox className="h-4 w-32 mb-3" />
        <SkeletonBox className="h-4 w-full max-w-md mb-1" />
        <SkeletonBox className="h-4 w-3/4 max-w-sm" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-github-bg/50 rounded-xl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <SkeletonBox className="h-7 w-16 mx-auto mb-1" />
          <SkeletonBox className="h-3 w-20 mx-auto" />
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-4">
      {[1, 2, 3].map((i) => (
        <SkeletonBox key={i} className="h-4 w-28" />
      ))}
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="skeleton-stats">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="card p-5">
        <SkeletonBox className="w-8 h-8 mb-3" />
        <SkeletonBox className="h-8 w-20 mb-1" />
        <SkeletonBox className="h-3 w-24" />
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="card p-6" id="skeleton-chart">
    <SkeletonBox className="h-6 w-40 mb-4" />
    <SkeletonBox className="h-[280px] w-full" />
  </div>
);

const InsightsSkeleton = () => (
  <div className="card p-6" id="skeleton-insights">
    <SkeletonBox className="h-6 w-44 mb-4" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-github-border/50">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-4 w-20" />
      </div>
    ))}
    <SkeletonBox className="h-20 w-full mt-4 rounded-xl" />
  </div>
);

const RepoCardSkeleton = () => (
  <div className="card p-5">
    <SkeletonBox className="h-5 w-48 mb-2" />
    <SkeletonBox className="h-4 w-full mb-1" />
    <SkeletonBox className="h-4 w-3/4 mb-4" />
    <div className="flex gap-4">
      <SkeletonBox className="h-4 w-20" />
      <SkeletonBox className="h-4 w-16" />
      <SkeletonBox className="h-4 w-16" />
    </div>
  </div>
);

const RepositoryListSkeleton = ({ count = 6 }) => (
  <div className="space-y-3" id="skeleton-repos">
    {Array.from({ length: count }).map((_, i) => (
      <RepoCardSkeleton key={i} />
    ))}
  </div>
);

export {
  ProfileSkeleton,
  StatsSkeleton,
  ChartSkeleton,
  InsightsSkeleton,
  RepositoryListSkeleton,
};
