import React from 'react';
import { XCircleIcon, ArrowPathIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry, retryCount = 0 }) => {
  // Determine error type
  const isRateLimit = message?.toLowerCase().includes('rate limit');
  const isNotFound = message?.toLowerCase().includes('not found');
  const isNetwork = message?.toLowerCase().includes('network');
  const isServer = message?.toLowerCase().includes('server');
  const isGitHubError = message?.toLowerCase().includes('github api error');

  // Get appropriate icon and title
  const getErrorConfig = () => {
    if (isNotFound) {
      return {
        icon: <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />,
        title: 'User Not Found',
        color: 'red',
        helpText: 'Please double-check the username and try again.'
      };
    }
    if (isRateLimit) {
      return {
        icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
        title: 'Rate Limit Exceeded',
        color: 'amber',
        helpText: 'GitHub API limit reached. Please wait a moment and try again.'
      };
    }
    if (isNetwork) {
      return {
        icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
        title: 'Network Error',
        color: 'yellow',
        helpText: 'Please check your internet connection and try again.'
      };
    }
    if (isServer) {
      return {
        icon: <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
        title: 'Server Error',
        color: 'orange',
        helpText: 'Our server is having issues. Please try again in a moment.'
      };
    }
    if (isGitHubError) {
      return {
        icon: <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
        title: 'GitHub API Error',
        color: 'blue',
        helpText: 'GitHub API returned an error. Please try again.'
      };
    }
    return {
      icon: <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: 'Something Went Wrong',
      color: 'red',
      helpText: 'Please try again in a moment.'
    };
  };

  const config = getErrorConfig();
  const colorClasses = {
    red: 'border-red-200/50 dark:border-red-500/20 bg-white/70 dark:bg-red-900/10',
    amber: 'border-amber-200/50 dark:border-amber-500/20 bg-white/70 dark:bg-amber-900/10',
    yellow: 'border-yellow-200/50 dark:border-yellow-500/20 bg-white/70 dark:bg-yellow-900/10',
    orange: 'border-orange-200/50 dark:border-orange-500/20 bg-white/70 dark:bg-orange-900/10',
    blue: 'border-blue-200/50 dark:border-blue-500/20 bg-white/70 dark:bg-blue-900/10',
  };

  const getButtonColor = () => {
    if (isNotFound) return 'bg-red-600 hover:bg-red-500 shadow-red-500/20';
    if (isRateLimit) return 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20';
    if (isNetwork) return 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20';
    if (isServer) return 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20';
    return 'bg-red-600 hover:bg-red-500 shadow-red-500/20';
  };

  return (
    <div className={`backdrop-blur-xl border rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300 ${colorClasses[config.color]}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-xl ${
          isNotFound ? 'bg-red-100 dark:bg-red-500/10' :
          isRateLimit ? 'bg-amber-100 dark:bg-amber-500/10' :
          isNetwork ? 'bg-yellow-100 dark:bg-yellow-500/10' :
          isServer ? 'bg-orange-100 dark:bg-orange-500/10' :
          isGitHubError ? 'bg-blue-100 dark:bg-blue-500/10' :
          'bg-red-100 dark:bg-red-500/10'
        }`}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wide mb-1">
            {config.title}
          </h4>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {message}
          </p>
          
          {!isNotFound && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 flex items-center gap-1.5">
              <ExclamationTriangleIcon className="h-3.5 w-3.5" />
              {config.helpText}
            </p>
          )}
          
          {isNotFound && (
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
              <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1.5">
                💡 <span>Tip: Check the spelling or try a different username</span>
              </p>
            </div>
          )}
          
          {isRateLimit && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-4 border border-amber-200 dark:border-amber-500/20">
              <p className="text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5">
                ⏳ <span>Rate limits reset every hour. Please wait a moment.</span>
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {onRetry && !isNotFound && (
              <button
                onClick={onRetry}
                disabled={retryCount >= 3}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-lg ${getButtonColor()}`}
              >
                <ArrowPathIcon className={`h-4 w-4 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
              </button>
            )}
            
            {retryCount > 0 && retryCount < 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Attempt {retryCount + 1} of 3
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;