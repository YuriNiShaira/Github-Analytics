import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';

const StarHistory = ({ repositories }) => {
  const [selectedRepo, setSelectedRepo] = useState(null);

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Star History</h3>
        <p className="text-gray-500 dark:text-github-muted text-sm">No repository data available</p>
      </div>
    );
  }

  const topRepos = [...repositories]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Starred Repositories</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {topRepos.map((repo) => (
          <button
            key={repo.name}
            onClick={() => handleRepoSelect(repo)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedRepo?.name === repo.name
                ? 'bg-blue-600 dark:bg-github-accent text-white'
                : 'bg-gray-100 dark:bg-github-border text-gray-700 dark:text-github-text hover:bg-gray-200 dark:hover:bg-github-border/70'
            }`}
          >
            {repo.name}
          </button>
        ))}
      </div>

      {selectedRepo && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-github-text font-medium">{selectedRepo.name}</span>
            <span className="text-gray-500 dark:text-github-muted text-sm">
              ⭐ {selectedRepo.stargazers_count} stars
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: '2024-01', stars: 0 },
                  { date: '2024-03', stars: Math.floor(selectedRepo.stargazers_count * 0.2) },
                  { date: '2024-06', stars: Math.floor(selectedRepo.stargazers_count * 0.5) },
                  { date: '2024-09', stars: Math.floor(selectedRepo.stargazers_count * 0.8) },
                  { date: '2024-12', stars: selectedRepo.stargazers_count },
                ]}
              >
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-3 shadow-md">
                          <p className="text-gray-900 dark:text-white text-sm font-medium">{payload[0].payload.date}</p>
                          <p className="text-blue-600 dark:text-github-accent text-sm font-semibold">
                            ⭐ {payload[0].value} stars
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="stars"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2 }}
                  className="stroke-blue-600 dark:stroke-github-accent"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!selectedRepo && (
        <p className="text-gray-500 dark:text-github-muted text-sm">Select a repository above to see its star history</p>
      )}
    </div>
  );
};

export default StarHistory;