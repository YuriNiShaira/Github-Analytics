import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4 w-full">
      {/* Profile Card Skeleton */}
      <div className="bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 h-40">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-300/30 dark:bg-white/10"></div>
          <div className="flex-1 space-y-3 mt-2">
            <div className="h-6 w-1/3 rounded-lg bg-gray-300/30 dark:bg-white/10"></div>
            <div className="h-4 w-2/3 rounded-lg bg-gray-300/30 dark:bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 h-24"></div>
        ))}
      </div>

      {/* Large Content Skeleton */}
      <div className="bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 h-64"></div>
    </div>
  );
};

export default SkeletonLoader;