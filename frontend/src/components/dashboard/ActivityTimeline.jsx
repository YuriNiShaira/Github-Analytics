import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';
import { ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const ActivityTimeline = ({ data }) => {
  const [viewType, setViewType] = useState('bar');

  // Check if data exists and is an array with content
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
        </div>
        <p className="text-github-muted text-sm">No activity data available</p>
        <p className="text-github-muted text-xs mt-2">Try searching for a more active GitHub user</p>
      </div>
    );
  }

  // Filter out dates with 0 commits for a cleaner view
  const filteredData = data.filter(d => d.commits > 0);
  
  // If all commits are 0, show message
  if (filteredData.length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
        </div>
        <p className="text-github-muted text-sm">No commit activity found in the last 30 days</p>
      </div>
    );
  }

  const totalCommits = data.reduce((sum, day) => sum + day.commits, 0);
  const avgCommits = (totalCommits / data.length).toFixed(1);
  const maxCommits = Math.max(...data.map(d => d.commits));
  const activeDays = data.filter(d => d.commits > 0).length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-github-card border border-github-border rounded-lg p-3">
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-github-accent text-sm">
            {payload[0].value} commits
          </p>
          {payload[0].value > 0 && (
            <div className="text-xs text-github-muted mt-1">
              {payload[0].value === 1 ? '1 commit' : `${payload[0].value} commits`}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
          <p className="text-github-muted text-sm">
            {totalCommits} commits in {data.length} days • Avg: {avgCommits} commits/day
          </p>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => setViewType('bar')}
            className={`p-1.5 rounded-md transition-colors ${
              viewType === 'bar' ? 'bg-github-accent text-white' : 'text-github-muted hover:text-white'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewType('line')}
            className={`p-1.5 rounded-md transition-colors ${
              viewType === 'line' ? 'bg-github-accent text-white' : 'text-github-muted hover:text-white'
            }`}
          >
            <ChartPieIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'bar' ? (
            <BarChart data={data}>
              <XAxis 
                dataKey="date" 
                stroke="#8b949e" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth()+1}/${date.getDate()}`;
                }}
                interval={Math.floor(data.length / 10)}
              />
              <YAxis 
                stroke="#8b949e" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="commits" 
                radius={[2, 2, 0, 0]}
                fill="#58a6ff"
              />
            </BarChart>
          ) : (
            <ComposedChart data={data}>
              <XAxis 
                dataKey="date" 
                stroke="#8b949e" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth()+1}/${date.getDate()}`;
                }}
                interval={Math.floor(data.length / 10)}
              />
              <YAxis 
                stroke="#8b949e" 
                fontSize={10}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="commits"
                fill="#58a6ff"
                fillOpacity={0.2}
                stroke="#58a6ff"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#58a6ff"
                strokeWidth={2}
                dot={{ fill: '#58a6ff', r: 3 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-github-border">
        <div className="text-center">
          <div className="text-github-muted text-xs">Total</div>
          <div className="text-white font-semibold">{totalCommits}</div>
        </div>
        <div className="text-center">
          <div className="text-github-muted text-xs">Average</div>
          <div className="text-white font-semibold">{avgCommits}</div>
        </div>
        <div className="text-center">
          <div className="text-github-muted text-xs">Max</div>
          <div className="text-white font-semibold">{maxCommits}</div>
        </div>
        <div className="text-center">
          <div className="text-github-muted text-xs">Active Days</div>
          <div className="text-white font-semibold">{activeDays}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;