import React, { useState } from 'react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ComparisonSearch = ({ onCompare, loading }) => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      onCompare(username1.trim(), username2.trim());
    }
  };

  const clearFields = () => {
    setUsername1('');
    setUsername2('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-gray-500 dark:text-github-muted text-xs mb-1 font-medium">User 1</label>
          <input
            type="text"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            placeholder="e.g., octocat"
            className="w-full px-3 py-2 bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg text-gray-900 dark:text-github-text placeholder-gray-400 dark:placeholder-github-muted focus:outline-none focus:border-blue-600 dark:focus:border-github-accent transition-colors shadow-sm"
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-center text-gray-400 dark:text-github-muted text-sm font-semibold pt-4 md:pt-6">
          VS
        </div>
        
        <div className="flex-1">
          <label className="block text-gray-500 dark:text-github-muted text-xs mb-1 font-medium">User 2</label>
          <input
            type="text"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            placeholder="e.g., torvalds"
            className="w-full px-3 py-2 bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg text-gray-900 dark:text-github-text placeholder-gray-400 dark:placeholder-github-muted focus:outline-none focus:border-blue-600 dark:focus:border-github-accent transition-colors shadow-sm"
            disabled={loading}
          />
        </div>

        <div className="flex items-end gap-2 justify-end md:justify-start pt-2 md:pt-0">
          <button
            type="submit"
            disabled={loading || !username1.trim() || !username2.trim()}
            className="px-4 py-2 bg-blue-600 dark:bg-github-accent text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium h-[42px]"
          >
            <UserPlusIcon className="h-4 w-4" />
            {loading ? 'Comparing...' : 'Compare'}
          </button>
          {(username1 || username2) && (
            <button
              type="button"
              onClick={clearFields}
              className="p-2 text-gray-400 dark:text-github-muted hover:text-gray-600 dark:hover:text-white transition-colors h-[42px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-github-border/50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ComparisonSearch;