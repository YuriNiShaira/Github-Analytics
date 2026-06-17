import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';
import { ChartBarIcon, ChartPieIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ActivityTimeline = ({ data, source = 'rest' }) => {
  // ✅ ALL hooks must be called at the top level, BEFORE any early returns
  const [viewType, setViewType] = useState('bar');
  const [dateRange, setDateRange] = useState('30');

  // ✅ useMemo is called unconditionally (even if data is empty)
  const filteredData = useMemo(() => {
    // If data is empty or invalid, return an empty array
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

  // ✅ Early returns AFTER all hooks are called
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
        </div>
        <p className="text-gray-500 dark:text-github-muted text-sm">No activity data available</p>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-github-muted" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-50 dark:bg-github-dark border border-gray-200 dark:border-github-border rounded-md px-2 py-1 text-gray-700 dark:text-github-text text-sm focus:outline-none focus:border-blue-600 dark:focus:border-github-accent transition-colors"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
        </div>
        <p className="text-gray-500 dark:text-github-muted text-sm">No activity in the selected date range</p>
      </div>
    );
  }

  // Calculate stats from contributions
  const totalContributions = filteredData.reduce((sum, day) => sum + day.commits, 0);
  const avgContributions = (totalContributions / filteredData.length).toFixed(1);
  const maxContributions = Math.max(...filteredData.map(d => d.commits));
  const activeDays = filteredData.filter(d => d.commits > 0).length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-3 shadow-md">
          <p className="text-gray-900 dark:text-white text-sm font-semibold">{label}</p>
          <p className="text-blue-600 dark:text-github-accent text-sm font-medium mt-0.5">
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
    const rangeMap = {
      '7': 'Last 7 Days',
      '30': 'Last 30 Days'
    };
    return rangeMap[dateRange] || 'Last 30 Days';
  };

  return (
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
          <p className="text-gray-500 dark:text-github-muted text-sm">
            {totalContributions} contributions in {filteredData.length} days • Avg: {avgContributions}/day
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-github-muted" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-50 dark:bg-github-dark border border-gray-200 dark:border-github-border rounded-md px-2 py-1 text-gray-700 dark:text-github-text text-sm focus:outline-none focus:border-blue-600 dark:focus:border-github-accent transition-colors"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          
          <div className="flex gap-1 bg-gray-100 dark:bg-github-dark p-1 rounded-md border border-gray-200 dark:border-transparent">
            <button
              onClick={() => setViewType('bar')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewType === 'bar' 
                  ? 'bg-white dark:bg-github-accent text-blue-600 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-github-muted hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('line')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewType === 'line' 
                  ? 'bg-white dark:bg-github-accent text-blue-600 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-github-muted hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ChartPieIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 dark:text-github-muted mb-4">
        Showing: <span className="text-gray-700 dark:text-github-text font-medium">{getRangeLabel()}</span>
        {source === 'graphql' && (
          <span className="ml-2 text-green-600 dark:text-green-400">✅ Accurate from GitHub API</span>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'bar' ? (
            <BarChart data={filteredData}>
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                interval={Math.floor(filteredData.length / 10)}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
              <Bar 
                dataKey="commits" 
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          ) : (
            <ComposedChart data={filteredData}>
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                interval={Math.floor(filteredData.length / 10)}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="commits"
                fill="#3b82f6"
                fillOpacity={0.1}
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-github-border">
        <div className="text-center">
          <div className="text-gray-400 dark:text-github-muted text-xs font-medium">Total</div>
          <div className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">{totalContributions}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 dark:text-github-muted text-xs font-medium">Average</div>
          <div className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">{avgContributions}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 dark:text-github-muted text-xs font-medium">Max</div>
          <div className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">{maxContributions}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 dark:text-github-muted text-xs font-medium">Active Days</div>
          <div className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">{activeDays}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-github-border">
        <p className="text-gray-400 dark:text-github-muted text-xs text-center">
          ℹ️ Shows <span className="text-gray-600 dark:text-github-text">contributions</span> (commits + issues + PRs + reviews) from the selected time period.
          {source === 'graphql' && ' ✅ Data is accurate from GitHub API'}
        </p>
      </div>
    </div>
  );
};

export default ActivityTimeline;