import React from 'react';
import { XCircleIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry, retryCount = 0 }) => {
  const isRateLimit = message?.toLowerCase().includes('rate limit');
  const isNotFound = message?.toLowerCase().includes('not found');

  return (
    <div className="bg-white/70 dark:bg-red-900/10 backdrop-blur-xl border border-red-200/50 dark:border-red-500/20 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Subtle glowing icon */}
        <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-xl">
          <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wide mb-1">
            {isNotFound ? 'User Not Found' : 'Connection Error'}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {message}
          </p>
          
          {isRateLimit && (
            <p className="text-amber-600 dark:text-amber-400 text-xs mb-4 font-medium flex items-center gap-1.5">
              <ExclamationTriangleIcon className="h-4 w-4" />
              GitHub API limit reached. Please wait a moment.
            </p>
          )}
          
          {isNotFound && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
              Please double-check the username and try again.
            </p>
          )}
          
          <div className="flex items-center gap-4">
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={retryCount >= 3}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                <ArrowPathIcon className={`h-4 w-4 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                {retryCount >= 3 ? 'Max Retries Reached' : 'Retry Connection'}
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