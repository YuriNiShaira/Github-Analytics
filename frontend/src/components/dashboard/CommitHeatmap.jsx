import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarIcon } from '@heroicons/react/24/outline';

const CommitHeatmap = ({ activity }) => {
  // Check if we have data
  if (!activity || typeof activity !== 'object') {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-github-muted" />
          <h3 className="text-lg font-semibold text-white">Commit Activity</h3>
        </div>
        <p className="text-github-muted text-sm">No commit activity data available</p>
      </div>
    );
  }

  // Convert object to array for Recharts
  const data = Object.entries(activity).map(([day, commits]) => ({
    day: day.slice(0, 3), // Mon, Tue, etc.
    commits: typeof commits === 'number' ? commits : 0,
    fullDay: day
  }));

  // Check if all commits are 0
  const totalCommits = data.reduce((sum, d) => sum + d.commits, 0);
  
  if (totalCommits === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-github-muted" />
          <h3 className="text-lg font-semibold text-white">Commit Activity</h3>
        </div>
        <p className="text-github-muted text-sm">No commit activity found for this user</p>
      </div>
    );
  }

  const maxCommits = Math.max(...data.map(d => d.commits));

  const getBarColor = (value) => {
    const ratio = value / maxCommits;
    if (ratio > 0.7) return '#58a6ff';
    if (ratio > 0.4) return '#79c0ff';
    if (ratio > 0.1) return '#a5d6ff';
    return '#21262d';
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-github-muted" />
          <h3 className="text-lg font-semibold text-white">Commit Activity</h3>
        </div>
        <span className="text-github-muted text-sm">
          Total: {totalCommits} commits
        </span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              stroke="#8b949e" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#8b949e" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-github-card border border-github-border rounded-lg p-3">
                      <p className="text-white text-sm font-medium">
                        {payload[0].payload.fullDay}
                      </p>
                      <p className="text-github-accent text-sm">
                        {payload[0].value} commits
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
      
      <div className="mt-4 flex items-center justify-between text-xs text-github-muted">
        <span>Less active</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 rounded-sm bg-[#21262d]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#a5d6ff]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#79c0ff]"></div>
          <div className="w-4 h-3 rounded-sm bg-[#58a6ff]"></div>
        </div>
        <span>More active</span>
      </div>
    </div>
  );
};

export default CommitHeatmap;