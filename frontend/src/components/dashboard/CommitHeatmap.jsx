import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CommitHeatmap = ({ activity }) => {
  if (!activity || Object.values(activity).every(v => v === 0)) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Commit Activity</h3>
        <p className="text-github-muted text-sm">No commit data available</p>
      </div>
    );
  }

  const data = Object.entries(activity).map(([day, commits]) => ({
    day: day.slice(0, 3),
    commits,
    fullDay: day
  }));

  const maxCommits = Math.max(...data.map(d => d.commits));

  return (
    <div className="bg-github-card border border-github-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Commit Activity by Day</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#8b949e" fontSize={12} />
            <YAxis stroke="#8b949e" fontSize={12} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-github-card border border-github-border rounded-lg p-3">
                      <p className="text-white text-sm">{payload[0].payload.fullDay}</p>
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
              fill="#58a6ff"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitHeatmap;