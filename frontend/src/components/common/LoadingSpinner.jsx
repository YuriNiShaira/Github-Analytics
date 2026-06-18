import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6 w-full max-w-7xl mx-auto p-4">
      
      {/* 1. Premium Profile Card Skeleton */}
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Bone */}
          <div className="w-24 h-24 rounded-full bg-gray-300/40 dark:bg-white/5 shrink-0 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
          
          {/* Profile Identity Bones */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left mt-2">
            <div className="h-7 w-48 rounded-lg bg-gray-300/40 dark:bg-white/5 mx-auto sm:mx-0"></div>
            <div className="space-y-2">
              <div className="h-4 w-full max-w-md rounded-md bg-gray-300/30 dark:bg-white/5 mx-auto sm:mx-0"></div>
              <div className="h-4 w-2/3 max-w-xs rounded-md bg-gray-300/30 dark:bg-white/5 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid Skeleton (With internal content layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-5 h-28 flex flex-col justify-between shadow-lg">
            {/* Stat Label Line */}
            <div className="h-4 w-16 rounded-md bg-gray-300/40 dark:bg-white/5"></div>
            {/* Stat Big Number Line */}
            <div className="h-8 w-24 rounded-lg bg-gray-300/50 dark:bg-white/10"></div>
          </div>
        ))}
      </div>

      {/* 3. Main Split Dashboard Content (Matches your layout screenshots) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Card: Language Distribution Donut Skeleton */}
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl h-[400px] flex flex-col items-center justify-between">
          <div className="h-5 w-40 rounded-md bg-gray-300/40 dark:bg-white/5 self-start"></div>
          
          {/* Donut Circle Outline */}
          <div className="w-40 h-40 rounded-full border-[16px] border-gray-300/20 dark:border-white/5 flex items-center justify-center my-4"></div>
          
          {/* Legend Grid Placeholders */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 w-full pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300/40 dark:bg-white/5 shrink-0"></div>
                <div className="h-3 w-12 rounded bg-gray-300/30 dark:bg-white/5"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Repositories List Skeleton */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Header Actions Placeholder */}
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/30 dark:border-white/5">
            <div className="h-6 w-32 rounded-md bg-gray-300/40 dark:bg-white/5"></div>
            <div className="h-9 w-48 rounded-xl bg-gray-300/30 dark:bg-white/5"></div>
          </div>

          {/* List Rows Placeholders */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-300/10 dark:bg-white/[0.02] border border-gray-200/20 dark:border-white/[0.02]">
                <div className="space-y-2 flex-1">
                  {/* Repo Title */}
                  <div className="h-4 w-1/4 rounded bg-gray-300/40 dark:bg-white/10"></div>
                  {/* Repo Desc */}
                  <div className="h-3 w-1/2 rounded bg-gray-300/20 dark:bg-white/5"></div>
                </div>
                {/* Meta details right side */}
                <div className="flex gap-4 shrink-0">
                  <div className="h-4 w-12 rounded bg-gray-300/30 dark:bg-white/5"></div>
                  <div className="h-4 w-16 rounded bg-gray-300/30 dark:bg-white/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkeletonLoader;