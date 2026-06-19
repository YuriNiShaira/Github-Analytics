import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Loading Bar at Top - Highly Visible */}
      <div className="sticky top-0 z-50 -mx-4 px-4 py-3 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <div>
                <div className="h-4 w-32 rounded bg-gray-300/40 dark:bg-white/10 animate-pulse"></div>
                <div className="h-3 w-48 rounded bg-gray-300/20 dark:bg-white/5 animate-pulse mt-1"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs font-mono text-gray-400 dark:text-gray-500">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the skeleton with reduced opacity when loading */}
      <div className="opacity-60 pointer-events-none">
        {/* 1. Premium Profile Card Skeleton */}
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Bone */}
            <div className="w-24 h-24 rounded-full bg-gray-300/40 dark:bg-white/5 shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            {/* Profile Identity Bones */}
            <div className="flex-1 space-y-4 w-full text-center sm:text-left mt-2">
              <div className="h-7 w-48 rounded-lg bg-gray-300/40 dark:bg-white/5 mx-auto sm:mx-0 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full max-w-md rounded-md bg-gray-300/30 dark:bg-white/5 mx-auto sm:mx-0 animate-pulse"></div>
                <div className="h-4 w-2/3 max-w-xs rounded-md bg-gray-300/30 dark:bg-white/5 mx-auto sm:mx-0 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-5 h-28 flex flex-col justify-between shadow-lg">
              <div className="h-4 w-16 rounded-md bg-gray-300/40 dark:bg-white/5 animate-pulse"></div>
              <div className="h-8 w-24 rounded-lg bg-gray-300/50 dark:bg-white/10 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* 3. Main Split Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Card: Language Distribution Donut Skeleton */}
          <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl h-[400px] flex flex-col items-center justify-between">
            <div className="h-5 w-40 rounded-md bg-gray-300/40 dark:bg-white/5 self-start animate-pulse"></div>
            
            {/* Donut Circle Outline */}
            <div className="w-40 h-40 rounded-full border-[16px] border-gray-300/20 dark:border-white/5 flex items-center justify-center my-4 relative">
              <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-blue-500/30 animate-spin"></div>
            </div>
            
            {/* Legend Grid Placeholders */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 w-full pt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300/40 dark:bg-white/5 shrink-0 animate-pulse"></div>
                  <div className="h-3 w-12 rounded bg-gray-300/30 dark:bg-white/5 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Repositories List Skeleton */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header Actions Placeholder */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-200/30 dark:border-white/5">
              <div className="h-6 w-32 rounded-md bg-gray-300/40 dark:bg-white/5 animate-pulse"></div>
              <div className="h-9 w-48 rounded-xl bg-gray-300/30 dark:bg-white/5 animate-pulse"></div>
            </div>

            {/* List Rows Placeholders */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-300/10 dark:bg-white/[0.02] border border-gray-200/20 dark:border-white/[0.02]">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/4 rounded bg-gray-300/40 dark:bg-white/10 animate-pulse"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-300/20 dark:bg-white/5 animate-pulse"></div>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <div className="h-4 w-12 rounded bg-gray-300/30 dark:bg-white/5 animate-pulse"></div>
                    <div className="h-4 w-16 rounded bg-gray-300/30 dark:bg-white/5 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;