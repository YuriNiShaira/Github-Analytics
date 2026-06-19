import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CommitHeatmap = ({ activity, weekRange, onWeekChange }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const handlePreviousWeek = () => {
    const newOffset = weekOffset + 1;
    setWeekOffset(newOffset);
    if (onWeekChange) onWeekChange(newOffset);
  };

  const handleNextWeek = () => {
    if (weekOffset > 0) {
      const newOffset = weekOffset - 1;
      setWeekOffset(newOffset);
      if (onWeekChange) onWeekChange(newOffset);
    }
  };

  if (!activity || typeof activity !== 'object') {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">This Week</h3>
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No contribution data available</p>
        </div>
      </div>
    );
  }

  // Convert activity object to array and sort by day of week
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const data = Object.entries(activity)
    .map(([day, commits]) => ({
      day: day.slice(0, 3),
      commits: typeof commits === 'number' ? commits : 0,
      fullDay: day
    }))
    .sort((a, b) => dayOrder.indexOf(a.fullDay) - dayOrder.indexOf(b.fullDay));

  const totalContributions = data.reduce((sum, d) => sum + d.commits, 0);
  
  // Zero state
  if (totalContributions === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">This Week</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {weekRange?.start || 'No activity'}
            </span>
            <button
              onClick={handlePreviousWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleNextWeek}
              disabled={weekOffset === 0}
              className={`p-1.5 rounded-lg transition-colors ${
                weekOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No activity this week</p>
        </div>
      </div>
    );
  }

  const maxContributions = Math.max(...data.map(d => d.commits));

  const getBarColor = (value) => {
    if (value === 0) return 'rgba(148, 163, 184, 0.05)';
    const ratio = value / maxContributions;
    if (ratio > 0.7) return 'rgba(37, 99, 235, 1)';
    if (ratio > 0.4) return 'rgba(59, 130, 246, 0.8)';
    if (ratio > 0.1) return 'rgba(96, 165, 250, 0.5)';
    return 'rgba(147, 197, 253, 0.25)';
  };

  const mostActiveDay = data.reduce((a, b) => a.commits > b.commits ? a : b);

  // Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-gray-900 dark:text-gray-200 text-xs font-semibold mb-1">
            {payload[0].payload.fullDay}
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {payload[0].value} contribution{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format week label
  const weekLabel = weekRange 
    ? `${weekRange.start} - ${weekRange.end}`
    : weekOffset === 0 ? 'This Week' : `${weekOffset} week${weekOffset > 1 ? 's' : ''} ago`;

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">This Week</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {weekLabel}
          </span>
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={handleNextWeek}
            disabled={weekOffset === 0}
            className={`p-1.5 rounded-lg transition-colors ${
              weekOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              fontSize={11}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} content={<CustomTooltip />} />
            <Bar
              dataKey="commits"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.commits)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
        <span>Less</span>
        <div className="flex gap-1.5 border border-gray-200/50 dark:border-white/5 p-1 rounded-md bg-white/30 dark:bg-black/20">
          <div className="w-4 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(148, 163, 184, 0.05)' }}></div>
          <div className="w-4 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(147, 197, 253, 0.25)' }}></div>
          <div className="w-4 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(96, 165, 250, 0.5)' }}></div>
          <div className="w-4 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}></div>
          <div className="w-4 h-3 rounded-[3px]" style={{ backgroundColor: 'rgba(37, 99, 235, 1)' }}></div>
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="mt-5 pt-4 border-t border-gray-200/50 dark:border-white/5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-400 dark:text-gray-500">Total</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{totalContributions}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 dark:text-gray-500">Average</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {(totalContributions / 7).toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 dark:text-gray-500">Peak Day</div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {mostActiveDay?.fullDay || 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/5">
        <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
          Contributions by day of the week
        </p>
      </div>
    </div>
  );
};

export default CommitHeatmap;