import React, { useState } from 'react';
import { StarIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { formatNumber, formatDate, getLanguageColor } from '../../utils/formatters';

const RepositoriesTable = ({ repositories }) => {
  const [sortBy, setSortBy] = useState('stars');
  const [sortOrder, setSortOrder] = useState('desc');

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Repositories</h3>
        <p className="text-github-muted text-sm">No repositories found</p>
      </div>
    );
  }

  const sortedRepos = [...repositories].sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'stars':
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
        break;
      case 'forks':
        aVal = a.forks_count;
        bVal = b.forks_count;
        break;
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'updated':
        aVal = new Date(a.updated_at);
        bVal = new Date(b.updated_at);
        break;
      default:
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
    }
    
    if (sortOrder === 'desc') {
      return aVal > bVal ? -1 : 1;
    } else {
      return aVal < bVal ? -1 : 1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-github-border">
        <h3 className="text-lg font-semibold text-white">Repositories</h3>
        <p className="text-github-muted text-sm">
          Showing {repositories.length} repositories
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-github-dark border-b border-github-border">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-github-muted uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('name')}
              >
                Repository
                {sortBy === 'name' && (
                  <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-github-muted uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('stars')}
              >
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  Stars
                  {sortBy === 'stars' && (
                    <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-github-muted uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('forks')}
              >
                <div className="flex items-center gap-1">
                  <ArrowPathIcon className="h-4 w-4" />
                  Forks
                  {sortBy === 'forks' && (
                    <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-github-muted uppercase tracking-wider">
                Language
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-github-muted uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('updated')}
              >
                Updated
                {sortBy === 'updated' && (
                  <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-github-border">
            {sortedRepos.slice(0, 10).map((repo) => (
              <tr key={repo.name} className="hover:bg-github-dark/50 transition-colors">
                <td className="px-6 py-4">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-github-accent hover:underline font-medium flex items-center gap-1"
                  >
                    {repo.name}
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                  {repo.description && (
                    <p className="text-github-muted text-sm truncate max-w-md">
                      {repo.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-white">
                  {formatNumber(repo.stargazers_count)}
                </td>
                <td className="px-6 py-4 text-white">
                  {formatNumber(repo.forks_count)}
                </td>
                <td className="px-6 py-4">
                  {repo.language ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span className="text-github-text text-sm">{repo.language}</span>
                    </div>
                  ) : (
                    <span className="text-github-muted text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-github-muted text-sm">
                  {formatDate(repo.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {repositories.length > 10 && (
          <div className="px-6 py-3 text-center text-github-muted text-sm border-t border-github-border">
            Showing top 10 of {repositories.length} repositories
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoriesTable;