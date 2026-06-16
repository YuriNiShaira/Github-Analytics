import React, { useState, useMemo } from 'react';
import { 
  StarIcon, 
  ArrowPathIcon, 
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { formatNumber, formatDate, getLanguageColor } from '../../utils/formatters';

const RepositoriesTable = ({ repositories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('stars');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique languages from repositories
  const languages = useMemo(() => {
    const langs = new Set();
    repositories.forEach(repo => {
      if (repo.language) {
        langs.add(repo.language);
      }
    });
    return ['all', ...Array.from(langs).sort()];
  }, [repositories]);

  // Filter and sort repositories
  const filteredRepos = useMemo(() => {
    let filtered = [...repositories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

    // Sorting
    filtered.sort((a, b) => {
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

    return filtered;
  }, [repositories, searchTerm, selectedLanguage, sortBy, sortOrder]);

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-github-card border border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Repositories</h3>
        <p className="text-github-muted text-sm">No repositories found</p>
      </div>
    );
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortBy('stars');
    setSortOrder('desc');
  };

  return (
    <div className="bg-github-card border border-github-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-github-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Repositories</h3>
            <p className="text-github-muted text-sm">
              {filteredRepos.length} of {repositories.length} repositories
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-github-muted" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-github-dark border border-github-border rounded-md text-github-text text-sm placeholder-github-muted focus:outline-none focus:border-github-accent w-full sm:w-48 md:w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-github-muted hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                showFilters || selectedLanguage !== 'all'
                  ? 'bg-github-accent text-white'
                  : 'bg-github-dark text-github-text hover:bg-github-border'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {selectedLanguage !== 'all' && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                  1
                </span>
              )}
            </button>

            {/* Clear filters */}
            {(searchTerm || selectedLanguage !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-github-muted hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-github-border">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs text-github-muted mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-github-dark border border-github-border rounded-md px-3 py-1.5 text-github-text text-sm focus:outline-none focus:border-github-accent"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang === 'all' ? 'All Languages' : lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
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
            {filteredRepos.slice(0, 10).map((repo) => (
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
        {filteredRepos.length === 0 && (
          <div className="px-6 py-8 text-center text-github-muted">
            No repositories match your filters
          </div>
        )}
        {filteredRepos.length > 10 && (
          <div className="px-6 py-3 text-center text-github-muted text-sm border-t border-github-border">
            Showing 10 of {filteredRepos.length} repositories
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoriesTable;