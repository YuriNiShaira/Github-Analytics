import React from 'react';
import { StarIcon, ArrowPathIcon, CodeBracketIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '../../utils/formatters';

const StatsSummary = ({ stats }) => {
  const {
    total_stars = 0,
    total_forks = 0,
    total_repos = 0,
    total_contributions = 0,  // From GraphQL - total contributions (commits + issues + PRs + reviews)
    total_commits = 0,         // From GraphQL - actual commits (for reference)
    data_source = 'rest',      // 'graphql' or 'rest'
  } = stats;

  const statItems = [
    {
      label: 'Total Stars',
      value: formatNumber(total_stars),
      icon: StarIcon,
      color: 'text-yellow-500 dark:text-yellow-400',
    },
    {
      label: 'Total Forks',
      value: formatNumber(total_forks),
      icon: ArrowPathIcon,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Repos',
      value: formatNumber(total_repos),
      icon: CodeBracketIcon,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Contributions',
      value: total_contributions ? formatNumber(total_contributions) : 'N/A',
      icon: ClockIcon,
      color: 'text-purple-600 dark:text-purple-400',
      note: data_source === 'graphql' 
        ? 'Total this year' 
        : '⚠️ Estimated from public activity'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-4 transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <span className="text-gray-500 dark:text-github-muted text-sm">{item.label}</span>
              {item.note && (
                <div className="relative group">
                  <InformationCircleIcon className="h-4 w-4 text-gray-400 dark:text-github-muted cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-github-dark border border-gray-700 dark:border-github-border rounded-lg text-xs text-gray-200 dark:text-github-text max-w-xs whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {item.note}
                  </div>
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummary;