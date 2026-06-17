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
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        
        {/* User 1 Input */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-1">
            User 1
          </label>
          <div className="relative">
            {/* Sleek inline @ symbol */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-semibold select-none pointer-events-none">
              @
            </span>
            <input
              type="text"
              value={username1}
              onChange={(e) => setUsername1(e.target.value)}
              placeholder="octocat"
              className="w-full pl-9 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              disabled={loading}
            />
          </div>
        </div>
        
        {/* Decorative VS Badge (Hidden on mobile, centered on desktop) */}
        <div className="hidden md:flex items-center justify-center h-10 w-10 mt-8 shrink-0 rounded-full bg-white/60 dark:bg-[#0a0a0a]/80 border border-gray-200/50 dark:border-white/10 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
          VS
        </div>
        
        {/* User 2 Input */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-1">
            User 2
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-semibold select-none pointer-events-none">
              @
            </span>
            <input
              type="text"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              placeholder="torvalds"
              className="w-full pl-9 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full md:w-auto items-end gap-3 pt-2 md:pt-0 md:mt-8">
          <button
            type="submit"
            disabled={loading || !username1.trim() || !username2.trim()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-blue-500/30 h-[50px]"
          >
            <UserPlusIcon className="h-5 w-5" />
            {loading ? 'Comparing...' : 'Compare'}
          </button>
          
          {(username1 || username2) && (
            <button
              type="button"
              onClick={clearFields}
              className="flex items-center justify-center h-[50px] w-[50px] rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all shadow-sm"
              title="Clear fields"
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