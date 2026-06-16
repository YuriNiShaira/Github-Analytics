import React from 'react';
import { StarIcon, ArrowPathIcon, CodeBracketIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '../../utils/formatters';

const StatsSummary = ({ stats }) => {
  const {
    total_stars = 0,
    total_forks = 0,
    total_commits_estimate = 0,
    total_repos = 0,
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
      label: 'Commits (Est.)',
      value: total_commits_estimate ? formatNumber(total_commits_estimate) : 'N/A',
      icon: ClockIcon,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-4 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 mb-1">
            <item.icon className={`h-5 w-5 ${item.color}`} />
            <span className="text-gray-500 dark:text-github-muted text-sm">{item.label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;