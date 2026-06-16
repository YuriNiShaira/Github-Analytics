import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CommitHeatmap = ({ activity }) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  if (!activity || Object.values(activity).every(v => v === 0)) {
    return (
      /*  Updated container background, borders, and typography */
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commit Activity</h3>
        <p className="text-gray-500 dark:text-github-muted text-sm">No commit data available</p>
      </div>
    );
  }

  const data = Object.entries(activity).map(([day, commits]) => ({
    day: day.slice(0, 3),
    commits,
    fullDay: day
  }));

  return (
    /*  Updated wrapper card styling for light/dark mode */
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commit Activity by Day</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {/*  Changed stroke to a neutral slate gray that looks crisp on both white and dark backgrounds */}
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    /*  Fixed the tooltip card so it doesn't stay dark/white-texted in light mode */
                    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-3 shadow-md">
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{payload[0].payload.fullDay}</p>
                      <p className="text-blue-600 dark:text-github-accent text-sm font-semibold">
                        {payload[0].value} commits
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/*  Kept a classic blue theme fill that reads beautifully across both styles */}
            <Bar
              dataKey="commits"
              fill="#2563eb" 
              className="fill-blue-600 dark:fill-github-accent" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitHeatmap;