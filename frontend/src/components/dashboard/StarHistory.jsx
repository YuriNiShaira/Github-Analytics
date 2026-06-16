import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';

const StarHistory = ({ repositories }) => {
  const [selectedRepo, setSelectedRepo] = useState(null);

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Star History</h3>
        <p className="text-github-muted text-sm">No repository data available</p>
      </div>
    );
  }

  // Get top 5 starred repos
  const topRepos = [...repositories]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top Starred Repositories</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {topRepos.map((repo) => (
          <button
            key={repo.name}
            onClick={() => handleRepoSelect(repo)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedRepo?.name === repo.name
                ? 'bg-github-accent text-white'
                : 'bg-github-border text-github-text hover:bg-github-border/70'
            }`}
          >
            {repo.name}
          </button>
        ))}
      </div>

      {selectedRepo && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-github-text">{selectedRepo.name}</span>
            <span className="text-github-muted text-sm">
              ⭐ {selectedRepo.stargazers_count} stars
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  // This would be real data from GitHub API
                  // For now, simulate growth
                  { date: '2024-01', stars: 0 },
                  { date: '2024-03', stars: Math.floor(selectedRepo.stargazers_count * 0.2) },
                  { date: '2024-06', stars: Math.floor(selectedRepo.stargazers_count * 0.5) },
                  { date: '2024-09', stars: Math.floor(selectedRepo.stargazers_count * 0.8) },
                  { date: '2024-12', stars: selectedRepo.stargazers_count },
                ]}
              >
                <XAxis dataKey="date" stroke="#8b949e" fontSize={10} />
                <YAxis stroke="#8b949e" fontSize={10} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-github-card border border-github-border rounded-lg p-3">
                          <p className="text-white text-sm">{payload[0].payload.date}</p>
                          <p className="text-github-accent text-sm">
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
                  stroke="#58a6ff"
                  strokeWidth={2}
                  dot={{ fill: '#58a6ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!selectedRepo && (
        <p className="text-github-muted text-sm">Select a repository above to see its star history</p>
      )}
    </div>
  );
};

export default StarHistory;