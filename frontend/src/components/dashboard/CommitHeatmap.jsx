import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarIcon } from '@heroicons/react/24/outline';

const CommitHeatmap = ({ activity }) => {
  if (!activity || typeof activity !== 'object') {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-github-muted" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contribution Activity</h3>
        </div>
        <p className="text-gray-500 dark:text-github-muted text-sm">No contribution data available</p>
      </div>
    );
  }

  const data = Object.entries(activity).map(([day, commits]) => ({
    day: day.slice(0, 3),
    commits: typeof commits === 'number' ? commits : 0,
    fullDay: day
  }));

  const totalContributions = data.reduce((sum, d) => sum + d.commits, 0);
  
  if (totalContributions === 0) {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-github-muted" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contribution Activity</h3>
        </div>
        <p className="text-gray-500 dark:text-github-muted text-sm">No contribution activity found for this user</p>
      </div>
    );
  }

  const maxContributions = Math.max(...data.map(d => d.commits));

  const getBarColor = (value) => {
    const ratio = value / maxContributions;
    if (ratio > 0.7) return '#58a6ff';
    if (ratio > 0.4) return '#79c0ff';
    if (ratio > 0.1) return '#a5d6ff';
    return '#21262d';
  };

  // Find most active day
  const mostActiveDay = data.reduce((a, b) => a.commits > b.commits ? a : b);

  return (
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-github-muted" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contribution Activity</h3>
        </div>
        <div className="text-right">
          <span className="text-gray-500 dark:text-github-muted text-sm">
            Total: {totalContributions} contributions
          </span>
          {mostActiveDay && mostActiveDay.commits > 0 && (
            <div className="text-xs text-gray-400 dark:text-github-muted">
              Most active: {mostActiveDay.fullDay} ({mostActiveDay.commits} contributions)
            </div>
          )}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-3 shadow-md">
                      <p className="text-gray-900 dark:text-white text-sm font-medium">
                        {payload[0].payload.fullDay}
                      </p>
                      <p className="text-blue-600 dark:text-github-accent text-sm">
                        {payload[0].value} contribution{payload[0].value !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="commits"
              radius={[4, 4, 0, 0]}
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
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-github-muted">
        <span>Less active</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 rounded-sm bg-[#21262d]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#a5d6ff]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#79c0ff]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#58a6ff]"></div>
        </div>
        <span>More active</span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-github-border">
        <p className="text-gray-400 dark:text-github-muted text-xs text-center">
          ℹ️ Shows <span className="text-gray-600 dark:text-github-text">contributions</span> (commits + issues + PRs + reviews) by day of week.
          Total may differ from GitHub profile as it includes all contribution types.
        </p>
      </div>
    </div>
  );
};

export default CommitHeatmap;