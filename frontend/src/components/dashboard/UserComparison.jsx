import React, { useState } from 'react';
import { 
  StarIcon, 
  ArrowPathIcon, 
  UsersIcon,
  UserGroupIcon,
  FolderIcon,
  TrophyIcon
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
      <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compare Users</h3>
        <p className="text-gray-500 dark:text-github-muted text-sm">Enter two usernames to compare</p>
      </div>
    );
  }

  const renderUserCard = (user, isWinner) => {
    const languages = Object.entries(user.languages || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className={`bg-white dark:bg-github-card border rounded-lg p-4 transition-all ${
        isWinner 
          ? 'border-blue-600 dark:border-github-accent ring-1 ring-blue-600 dark:ring-github-accent' 
          : 'border-gray-200 dark:border-github-border'
      }`}>
        {isWinner && (
          <div className="flex items-center gap-1 text-blue-600 dark:text-github-accent text-sm font-medium mb-2">
            <TrophyIcon className="h-4 w-4" />
            <span>Winner</span>
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-github-border"
          />
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold">{user.name || user.username}</h4>
            <p className="text-gray-500 dark:text-github-muted text-sm">@{user.username}</p>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-700 dark:text-github-text text-sm mb-3 line-clamp-2">{user.bio}</p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-gray-500 dark:text-github-muted text-xs">Followers</div>
            <div className="text-gray-900 dark:text-white font-semibold">{formatNumber(user.followers)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-github-muted text-xs">Stars</div>
            <div className="text-gray-900 dark:text-white font-semibold">{formatNumber(user.total_stars)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-github-muted text-xs">Forks</div>
            <div className="text-gray-900 dark:text-white font-semibold">{formatNumber(user.total_forks)}</div>
          </div>
        </div>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {languages.map(([lang, bytes]) => (
              <span
                key={lang}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-github-border text-gray-700 dark:text-github-text flex items-center gap-1"
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
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Comparison</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-500 dark:text-github-muted hover:text-gray-700 dark:hover:text-white text-sm transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-github-dark rounded-lg p-3 text-center">
          <div className="text-gray-500 dark:text-github-muted text-xs">Followers</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user1.followers)}</span>
            <span className="text-gray-400 dark:text-github-muted text-sm">vs</span>
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user2.followers)}</span>
          </div>
          <div className={`text-xs font-medium ${comparison.followers_diff > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {comparison.followers_diff > 0 ? '+' : ''}{comparison.followers_diff}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-github-dark rounded-lg p-3 text-center">
          <div className="text-gray-500 dark:text-github-muted text-xs">Stars</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user1.total_stars)}</span>
            <span className="text-gray-400 dark:text-github-muted text-sm">vs</span>
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user2.total_stars)}</span>
          </div>
          <div className={`text-xs font-medium ${comparison.stars_diff > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {comparison.stars_diff > 0 ? '+' : ''}{comparison.stars_diff}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-github-dark rounded-lg p-3 text-center">
          <div className="text-gray-500 dark:text-github-muted text-xs">Repositories</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user1.public_repos)}</span>
            <span className="text-gray-400 dark:text-github-muted text-sm">vs</span>
            <span className="text-gray-900 dark:text-white font-semibold">{formatNumber(user2.public_repos)}</span>
          </div>
          <div className={`text-xs font-medium ${comparison.repos_diff > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {comparison.repos_diff > 0 ? '+' : ''}{comparison.repos_diff}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-github-dark rounded-lg p-3 text-center flex flex-col justify-center items-center">
          <div className="text-gray-500 dark:text-github-muted text-xs">Winner</div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg">
            {comparison.winner === 'tie' ? '🤝 Tie!' : `🏆 @${comparison.winner}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderUserCard(user1, comparison.winner === user1.username)}
        {renderUserCard(user2, comparison.winner === user2.username)}
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-github-border">
          <h4 className="text-gray-900 dark:text-white font-medium mb-3">Detailed Comparison</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-github-muted">Total Stars</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatNumber(user1.total_stars)} vs {formatNumber(user2.total_stars)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-github-muted">Total Forks</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatNumber(user1.total_forks)} vs {formatNumber(user2.total_forks)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-github-muted">Followers</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatNumber(user1.followers)} vs {formatNumber(user2.followers)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-github-muted">Following</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatNumber(user1.following)} vs {formatNumber(user2.following)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-github-muted">Repositories</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatNumber(user1.public_repos)} vs {formatNumber(user2.public_repos)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComparison;