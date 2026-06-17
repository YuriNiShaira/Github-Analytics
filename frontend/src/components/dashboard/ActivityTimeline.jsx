import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';
import { ChartBarIcon, ChartPieIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ActivityTimeline = ({ data, source = 'rest' }) => {
  const [viewType, setViewType] = useState('bar');
  const [dateRange, setDateRange] = useState('30');

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const now = new Date();
    const daysToShow = parseInt(dateRange);
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
    
    return data
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate && itemDate <= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, dateRange]);

  // Premium Glassmorphism Empty State
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Activity Timeline</h3>
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No activity data available to display.</p>
        </div>
      </div>
    );
  }

  // Premium Glassmorphism "No Activity in Range" State
  if (filteredData.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Activity Timeline</h3>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="7" className="bg-white dark:bg-black">Last 7 days</option>
              <option value="30" className="bg-white dark:bg-black">Last 30 days</option>
            </select>
          </div>
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No activity in the selected date range.</p>
        </div>
      </div>
    );
  }

  const totalContributions = filteredData.reduce((sum, day) => sum + day.commits, 0);
  const avgContributions = (totalContributions / filteredData.length).toFixed(1);
  const maxContributions = Math.max(...filteredData.map(d => d.commits));
  const activeDays = filteredData.filter(d => d.commits > 0).length;

  // Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl p-3 shadow-xl">
          <p className="text-gray-900 dark:text-gray-200 text-xs font-semibold mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {payload[0].value} contribution{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getDate()}`;
  };

  const getRangeLabel = () => {
    const rangeMap = { '7': 'Last 7 Days', '30': 'Last 30 Days' };
    return rangeMap[dateRange] || 'Last 30 Days';
  };

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Activity Timeline</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            Showing: <span className="text-gray-700 dark:text-gray-300 font-medium">{getRangeLabel()}</span>
            {source === 'graphql' && (
              <span className="text-green-600 dark:text-green-400 font-medium bg-green-100/50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                API Verified
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg px-2 py-1">
            <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 text-sm focus:outline-none cursor-pointer"
            >
              <option value="7" className="bg-white dark:bg-[#0a0a0a]">7 days</option>
              <option value="30" className="bg-white dark:bg-[#0a0a0a]">30 days</option>
            </select>
          </div>
          
          <div className="flex gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-lg border border-gray-200/50 dark:border-white/10">
            <button
              onClick={() => setViewType('bar')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewType === 'bar' 
                  ? 'bg-white dark:bg-[#1a1a1a] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-white/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('line')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewType === 'line' 
                  ? 'bg-white dark:bg-[#1a1a1a] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-white/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ChartPieIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'bar' ? (
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                interval={Math.floor(filteredData.length / 10)}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              <Bar 
                dataKey="commits" 
                radius={[4, 4, 0, 0]}
                fill="url(#colorBar)"
                maxBarSize={40}
              />
            </BarChart>
          ) : (
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                interval={Math.floor(filteredData.length / 10)}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="commits"
                fill="url(#colorArea)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#0a0a0a', r: 4, strokeWidth: 2, stroke: '#3b82f6' }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats Grid - Now responsive (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200/50 dark:border-white/5">
        <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-gray-200/50 dark:border-white/5">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Total</div>
          <div className="text-gray-900 dark:text-white font-bold text-xl mt-1">{totalContributions}</div>
        </div>
        <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-gray-200/50 dark:border-white/5">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Average</div>
          <div className="text-gray-900 dark:text-white font-bold text-xl mt-1">{avgContributions}</div>
        </div>
        <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-gray-200/50 dark:border-white/5">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Max</div>
          <div className="text-gray-900 dark:text-white font-bold text-xl mt-1">{maxContributions}</div>
        </div>
        <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-gray-200/50 dark:border-white/5">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Active Days</div>
          <div className="text-gray-900 dark:text-white font-bold text-xl mt-1">{activeDays}</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Contributions include commits, issues, PRs, and reviews.
        </p>
      </div>
    </div>
  );
};

export default ActivityTimeline;