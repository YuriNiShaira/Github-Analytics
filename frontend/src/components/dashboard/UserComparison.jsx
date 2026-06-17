import React, { useState } from 'react';
import { 
  StarIcon, 
  ArrowPathIcon, 
  UsersIcon,
  UserGroupIcon,
  FolderIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { formatNumber, getLanguageColor } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const UserComparison = ({ user1, user2, comparison, loading, error }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Comparing users..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user1 || !user2) {
    return (
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide mb-4">Compare Users</h3>
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">Enter two usernames above to compare their GitHub statistics.</p>
        </div>
      </div>
    );
  }

  const renderUserCard = (user, isWinner) => {
    const languages = Object.entries(user.languages || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className={`relative bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl p-5 transition-all duration-300 ${
        isWinner 
          ? 'border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:shadow-[0_0_20px_rgba(59,130,246,0.1)] scale-[1.02] z-10' 
          : 'border border-gray-200/50 dark:border-white/10'
      }`}>
        {isWinner && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/30">
            <TrophyIcon className="h-3.5 w-3.5" />
            WINNER
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 mt-2">
          <img
            src={user.avatar_url}
            alt={user.username}
            className={`w-16 h-16 rounded-full object-cover shadow-md ${
              isWinner ? 'ring-4 ring-blue-500/30 dark:ring-blue-500/20' : 'border-2 border-gray-200/50 dark:border-white/10'
            }`}
          />
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{user.name || user.username}</h4>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">@{user.username}</p>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 text-center sm:text-left leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-100/50 dark:bg-[#0a0a0a]/50 rounded-xl p-3 border border-gray-200/50 dark:border-white/5">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Followers</div>
            <div className="text-gray-900 dark:text-white font-bold">{formatNumber(user.followers)}</div>
          </div>
          <div className="text-center border-x border-gray-200/50 dark:border-white/5">
            <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Stars</div>
            <div className="text-gray-900 dark:text-white font-bold">{formatNumber(user.total_stars)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Forks</div>
            <div className="text-gray-900 dark:text-white font-bold">{formatNumber(user.total_forks)}</div>
          </div>
        </div>

        {/* Top Languages */}
        {languages.length > 0 && (
          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
            {languages.map(([lang]) => (
              <span
                key={lang}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/60 dark:bg-[#0a0a0a]/60 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 flex items-center gap-1.5 shadow-sm"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang) }}
                />
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide flex items-center gap-2">
          User Comparison
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white text-sm font-semibold transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
        >
          {showDetails ? (
            <><ChevronUpIcon className="h-4 w-4" /> Hide Details</>
          ) : (
            <><ChevronDownIcon className="h-4 w-4" /> Show Details</>
          )}
        </button>
      </div>

      {/* Versus Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center shadow-sm">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Followers</div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user1.followers)}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#0a0a0a] px-1.5 py-0.5 rounded uppercase">vs</span>
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user2.followers)}</span>
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${comparison.followers_diff > 0 ? 'bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {comparison.followers_diff > 0 ? '+' : ''}{comparison.followers_diff} gap
          </div>
        </div>

        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center shadow-sm">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Stars</div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user1.total_stars)}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#0a0a0a] px-1.5 py-0.5 rounded uppercase">vs</span>
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user2.total_stars)}</span>
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${comparison.stars_diff > 0 ? 'bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {comparison.stars_diff > 0 ? '+' : ''}{comparison.stars_diff} gap
          </div>
        </div>

        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center shadow-sm">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Repositories</div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user1.public_repos)}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#0a0a0a] px-1.5 py-0.5 rounded uppercase">vs</span>
            <span className="text-gray-900 dark:text-white font-extrabold text-lg">{formatNumber(user2.public_repos)}</span>
          </div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${comparison.repos_diff > 0 ? 'bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {comparison.repos_diff > 0 ? '+' : ''}{comparison.repos_diff} gap
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-500/20 rounded-xl p-4 text-center flex flex-col justify-center items-center shadow-sm">
          <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Overall Winner</div>
          <div className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">
            {comparison.winner === 'tie' ? '🤝 Tie!' : `@${comparison.winner}`}
          </div>
        </div>
      </div>

      {/* Main Versus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Subtle decorative VS circle between cards on desktop */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-full items-center justify-center z-20 shadow-lg text-xs font-bold text-gray-500 dark:text-gray-400">
          VS
        </div>
        
        {renderUserCard(user1, comparison.winner === user1.username)}
        {renderUserCard(user2, comparison.winner === user2.username)}
      </div>

      {/* Expandable Details Table */}
      {showDetails && (
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-white/10 animate-fade-in">
          <h4 className="text-gray-900 dark:text-white font-bold mb-4 tracking-wide">Detailed Breakdown</h4>
          <div className="bg-white/40 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200/50 dark:divide-white/5">
              {[
                { label: 'Total Stars', val1: user1.total_stars, val2: user2.total_stars },
                { label: 'Total Forks', val1: user1.total_forks, val2: user2.total_forks },
                { label: 'Followers', val1: user1.followers, val2: user2.followers },
                { label: 'Following', val1: user1.following, val2: user2.following },
                { label: 'Public Repositories', val1: user1.public_repos, val2: user2.public_repos },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm w-1/3">{row.label}</span>
                  <div className="w-2/3 flex justify-between items-center gap-4">
                    <span className={`text-sm font-bold w-full text-right ${row.val1 > row.val2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatNumber(row.val1)}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                    <span className={`text-sm font-bold w-full text-left ${row.val2 > row.val1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatNumber(row.val2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComparison;