import React, { useState, useMemo } from 'react';
import { 
  StarIcon, 
  ArrowPathIcon, 
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { formatNumber, formatDate, getLanguageColor } from '../../utils/formatters';

const RepositoriesTable = ({ repositories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('stars');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique languages
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

    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

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

  // Pagination
  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRepos = filteredRepos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Repositories</h3>
        <p className="text-gray-500 dark:text-github-muted text-sm">No repositories found</p>
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
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortBy('stars');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg overflow-hidden transition-colors duration-300 shadow-sm">
      {/* Header with search and filters */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-github-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repositories</h3>
            <p className="text-gray-500 dark:text-github-muted text-sm">
              {filteredRepos.length} of {repositories.length} repositories
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-github-muted" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 py-1.5 bg-gray-50 dark:bg-github-dark border border-gray-200 dark:border-github-border rounded-md text-gray-900 dark:text-github-text text-sm placeholder-gray-400 dark:placeholder-github-muted focus:outline-none focus:border-blue-600 dark:focus:border-github-accent w-full sm:w-48 md:w-64 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-2 text-gray-400 dark:text-github-muted hover:text-gray-600 dark:hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                showFilters || selectedLanguage !== 'all'
                  ? 'bg-blue-600 dark:bg-github-accent text-white border-transparent'
                  : 'bg-gray-50 dark:bg-github-dark text-gray-700 dark:text-github-text border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-github-border'
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
                className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-github-muted hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-github-border">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-github-muted mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 dark:bg-github-dark border border-gray-200 dark:border-github-border rounded-md px-3 py-1.5 text-gray-700 dark:text-github-text text-sm focus:outline-none focus:border-blue-600 dark:focus:border-github-accent transition-colors cursor-pointer"
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
          <thead className="bg-gray-50 dark:bg-github-dark border-b border-gray-200 dark:border-github-border select-none">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-github-muted uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                Repository
                {sortBy === 'name' && (
                  <span className="ml-1 text-blue-600 dark:text-github-accent">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-github-muted uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('stars')}
              >
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  Stars
                  {sortBy === 'stars' && (
                    <span className="ml-1 text-blue-600 dark:text-github-accent">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-github-muted uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('forks')}
              >
                <div className="flex items-center gap-1">
                  <ArrowPathIcon className="h-4 w-4" />
                  Forks
                  {sortBy === 'forks' && (
                    <span className="ml-1 text-blue-600 dark:text-github-accent">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-github-muted uppercase tracking-wider">
                Language
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-github-muted uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('updated')}
              >
                Updated
                {sortBy === 'updated' && (
                  <span className="ml-1 text-blue-600 dark:text-github-accent">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-github-border">
            {paginatedRepos.map((repo) => (
              <tr key={repo.name} className="hover:bg-gray-50 dark:hover:bg-github-dark/50 transition-colors">
                <td className="px-6 py-4">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-github-accent hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {repo.name}
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                  {repo.description && (
                    <p className="text-gray-500 dark:text-github-muted text-sm truncate max-w-md mt-0.5">
                      {repo.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {formatNumber(repo.stargazers_count)}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {formatNumber(repo.forks_count)}
                </td>
                <td className="px-6 py-4">
                  {repo.language ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span className="text-gray-700 dark:text-github-text text-sm">{repo.language}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-github-muted text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-github-muted text-sm whitespace-nowrap">
                  {formatDate(repo.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty state */}
        {filteredRepos.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-github-muted">
            No repositories match your filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredRepos.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-github-border flex items-center justify-between flex-wrap gap-4">
          <div className="text-gray-500 dark:text-github-muted text-sm">
            Showing <span className="font-medium text-gray-800 dark:text-gray-200">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {Math.min(startIndex + itemsPerPage, filteredRepos.length)}
            </span>{' '}
            of <span className="font-medium text-gray-800 dark:text-gray-200">{filteredRepos.length}</span> repositories
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md bg-white dark:bg-github-dark border border-gray-200 dark:border-github-border text-gray-500 dark:text-github-muted hover:text-gray-700 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-none"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-gray-700 dark:text-github-text text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md bg-white dark:bg-github-dark border border-gray-200 dark:border-github-border text-gray-500 dark:text-github-muted hover:text-gray-700 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-none"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoriesTable;