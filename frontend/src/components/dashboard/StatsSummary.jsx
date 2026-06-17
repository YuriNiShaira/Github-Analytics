import React from 'react';
import { StarIcon, ArrowPathIcon, CodeBracketIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '../../utils/formatters';

const StatsSummary = ({ stats }) => {
  const {
    total_stars = 0,
    total_forks = 0,
    total_repos = 0,
    total_contributions = 0,
    data_source = 'rest',
  } = stats;

  const statItems = [
    {
      label: 'Total Stars',
      value: formatNumber(total_stars),
      icon: StarIcon,
      textColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-500/10',
      borderColor: 'border-yellow-200 dark:border-yellow-500/20'
    },
    {
      label: 'Total Forks',
      value: formatNumber(total_forks),
      icon: ArrowPathIcon,
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-500/20'
    },
    {
      label: 'Total Repos',
      value: formatNumber(total_repos),
      icon: CodeBracketIcon,
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-500/10',
      borderColor: 'border-green-200 dark:border-green-500/20'
    },
    {
      label: 'Total Contributions',
      value: total_contributions ? formatNumber(total_contributions) : 'N/A',
      icon: ClockIcon,
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-500/10',
      borderColor: 'border-purple-200 dark:border-purple-500/20',
      note: data_source === 'graphql' 
        ? 'Total this year' 
        : '⚠️ Estimated from public activity'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-5 shadow-xl dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:hover:bg-white/5 cursor-default overflow-visible"
          >
            {/* Subtle background glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-transparent to-current ${item.textColor} rounded-2xl pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                
                {/* Glowing Icon Wrapper */}
                <div className={`p-2.5 rounded-xl border ${item.bgColor} ${item.borderColor} shadow-sm`}>
                  <item.icon className={`h-5 w-5 ${item.textColor}`} />
                </div>

                {/* ROCK SOLID TOOLTIP */}
                {item.note && (
                  <div className="relative flex items-center group/tooltip">
                    <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-help transition-colors" />
                    
                    {/* w-max forces the background to hug the text.
                      right-0 anchors it so it doesn't bleed off the right side of the screen.
                    */}
                    <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-gray-900 dark:bg-[#1a1a1a] border border-gray-700 dark:border-white/10 rounded-lg text-xs font-medium text-white shadow-xl opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-200 pointer-events-none z-[60]">
                      {item.note}
                    </div>
                  </div>
                )}

              </div>
              
              <div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummary;