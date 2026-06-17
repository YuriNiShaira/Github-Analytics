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
  
  // Adjusted to show exactly 5 repositories per page
  const itemsPerPage = 5;

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

  // Premium Empty State
  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide mb-4">Repositories</h3>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No repositories found</p>
        </div>
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
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Header with search and filters */}
      <div className="px-6 py-5 border-b border-gray-200/50 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Repositories</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {filteredRepos.length} of {repositories.length} repositories
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 py-2 bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-48 md:w-64 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                showFilters || selectedLanguage !== 'all'
                  ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-500/20'
                  : 'bg-white/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {selectedLanguage !== 'all' && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-md text-xs">
                  1
                </span>
              )}
            </button>

            {/* Clear filters */}
            {(searchTerm || selectedLanguage !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-white/5 animate-fade-in">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang} className="bg-white dark:bg-[#0a0a0a]">
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
          <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5 select-none">
            <tr>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                Repository
                {sortBy === 'name' && (
                  <span className="ml-1 text-blue-600 dark:text-blue-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('stars')}
              >
                <div className="flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4" />
                  Stars
                  {sortBy === 'stars' && (
                    <span className="ml-1 text-blue-600 dark:text-blue-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('forks')}
              >
                <div className="flex items-center gap-1.5">
                  <ArrowPathIcon className="h-4 w-4" />
                  Forks
                  {sortBy === 'forks' && (
                    <span className="ml-1 text-blue-600 dark:text-blue-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Language
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('updated')}
              >
                Updated
                {sortBy === 'updated' && (
                  <span className="ml-1 text-blue-600 dark:text-blue-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-white/5 bg-transparent">
            {paginatedRepos.map((repo) => (
              <tr key={repo.name} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white hover:underline font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    {repo.name}
                    <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-70" />
                  </a>
                  {repo.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-md mt-1">
                      {repo.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {formatNumber(repo.stargazers_count)}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {formatNumber(repo.forks_count)}
                </td>
                <td className="px-6 py-4">
                  {repo.language ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{repo.language}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap font-medium">
                  {formatDate(repo.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty search state */}
        {filteredRepos.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No repositories match your filters</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredRepos.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between flex-wrap gap-4 bg-white/30 dark:bg-black/20">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Showing <span className="font-bold text-gray-900 dark:text-white">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-gray-900 dark:text-white">
              {Math.min(startIndex + itemsPerPage, filteredRepos.length)}
            </span>{' '}
            of <span className="font-bold text-gray-900 dark:text-white">{filteredRepos.length}</span> repositories
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
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