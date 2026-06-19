import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CommitHeatmap = ({ activity }) => {
  const [dateRange, setDateRange] = useState('7'); // '7' or '30'

  // If activity is null or empty
  if (!activity || typeof activity !== 'object') {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Contribution Activity</h3>
        </div>
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No contribution data available</p>
        </div>
      </div>
    );
  }

  // Convert activity object to array and sort by day of week
  const allData = Object.entries(activity).map(([day, commits]) => ({
    day: day.slice(0, 3),
    commits: typeof commits === 'number' ? commits : 0,
    fullDay: day
  }));

  // Sort days in correct order
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedData = [...allData].sort((a, b) => dayOrder.indexOf(a.fullDay) - dayOrder.indexOf(b.fullDay));

  const totalContributions = sortedData.reduce((sum, d) => sum + d.commits, 0);
  
  if (totalContributions === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Contribution Activity</h3>
        </div>
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No contribution activity found</p>
        </div>
      </div>
    );
  }

  const maxContributions = Math.max(...sortedData.map(d => d.commits));

  const getBarColor = (value) => {
    if (value === 0) return 'rgba(148, 163, 184, 0.05)';
    const ratio = value / maxContributions;
    if (ratio > 0.7) return 'rgba(37, 99, 235, 1)';
    if (ratio > 0.4) return 'rgba(59, 130, 246, 0.8)';
    if (ratio > 0.1) return 'rgba(96, 165, 250, 0.5)';
    return 'rgba(147, 197, 253, 0.25)';
  };

  const mostActiveDay = sortedData.reduce((a, b) => a.commits > b.commits ? a : b);

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

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Contribution Activity</h3>
        </div>
        
        {/* Date Range Filter - Same as Activity Timeline */}
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/50 dark:bg-black/30 border border-gray-200/50 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              {sortedData.map((entry, index) => (
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

      {/* Stats Footer */}
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
          <div className="text-xs text-gray-400 dark:text-gray-500">Most Active</div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {mostActiveDay?.fullDay || 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/5">
        <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
          Contributions by day of week
        </p>
      </div>
    </div>
  );
};

export default CommitHeatmap;