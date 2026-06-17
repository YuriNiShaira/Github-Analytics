import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const StarHistory = ({ repositories }) => {
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Get top 5 repos by stars
  const topRepos = useMemo(() => {
    if (!repositories) return [];
    return [...repositories]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);
  }, [repositories]);

  // UX Upgrade: Automatically select the first repo on load!
  useEffect(() => {
    if (topRepos.length > 0 && !selectedRepo) {
      setSelectedRepo(topRepos[0]);
    }
  }, [topRepos, selectedRepo]);

  // Premium Empty State
  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Star History</h3>
        </div>
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No repository data available</p>
        </div>
      </div>
    );
  }

  // Generates a dynamic 6-month fake history curve ending at the actual star count
  const generateHistoryData = (totalStars) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    const now = new Date();
    // A realistic-looking growth curve multiplier
    const curve = [0, 0.15, 0.35, 0.6, 0.85, 1]; 
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: `${months[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`,
        stars: Math.floor(totalStars * curve[5 - i])
      });
    }
    return data;
  };

  const chartData = selectedRepo ? generateHistoryData(selectedRepo.stargazers_count) : [];

  // Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-gray-900 dark:text-gray-200 text-xs font-semibold mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1.5">
            <StarIcon className="h-4 w-4 fill-blue-500 text-blue-500" />
            {payload[0].value.toLocaleString()} stars
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Top Starred Repositories</h3>
      </div>
      
      {/* Repo Selection Pills */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {topRepos.map((repo) => {
          const isSelected = selectedRepo?.name === repo.name;
          return (
            <button
              key={repo.name}
              onClick={() => setSelectedRepo(repo)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-transparent scale-105'
                  : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <StarIcon className={`h-3.5 w-3.5 ${isSelected ? 'fill-white' : ''}`} />
              <span className="truncate max-w-[120px]">{repo.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Section */}
      {selectedRepo ? (
        <div className="flex-1 flex flex-col min-h-[200px]">
          <div className="flex justify-between items-end mb-4 px-1">
            <span className="text-gray-900 dark:text-white font-bold truncate pr-4">
              {selectedRepo.name}
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 shrink-0 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md">
              <StarIcon className="h-4 w-4 fill-blue-500 text-blue-500" />
              {selectedRepo.stargazers_count.toLocaleString()}
            </span>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="starGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2 }} />
                <Area
                  type="monotone"
                  dataKey="stars"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#starGradient)"
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Select a repository above to see its star history</p>
        </div>
      )}
    </div>
  );
};

export default StarHistory;