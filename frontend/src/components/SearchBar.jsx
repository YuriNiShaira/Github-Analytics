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
          className="w-full px-4 py-3 pl-12 bg-github-card border border-github-border rounded-lg text-github-text placeholder-github-muted focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent transition-colors"
          disabled={loading}
        />
        <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-github-muted" />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="absolute right-2 top-2 px-4 py-1.5 bg-github-accent text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;