import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch, loading, initialValue = '' }) => {
  const [username, setUsername] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username (e.g., octocat)"
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg text-gray-900 dark:text-github-text placeholder-gray-400 dark:placeholder-github-muted focus:outline-none focus:border-blue-600 dark:focus:border-github-accent focus:ring-1 focus:ring-blue-600 dark:focus:ring-github-accent transition-colors shadow-sm"
          disabled={loading}
        />
        <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-github-muted" />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 dark:bg-github-accent text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;