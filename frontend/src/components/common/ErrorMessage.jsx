import React from 'react';
import { XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onRetry, retryCount = 0 }) => {
  // Check if it's a rate limit error
  const isRateLimit = message?.toLowerCase().includes('rate limit');
  const isNotFound = message?.toLowerCase().includes('not found');

  return (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-400 text-sm">{message}</p>
          
          {isRateLimit && (
            <p className="text-github-muted text-xs mt-1">
              GitHub API rate limit reached. Please wait a moment and try again.
            </p>
          )}
          
          {isNotFound && (
            <p className="text-github-muted text-xs mt-1">
              Make sure the username is spelled correctly and exists on GitHub.
            </p>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={retryCount >= 3}
              className="mt-2 text-sm bg-github-accent text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <ArrowPathIcon className="h-4 w-4" />
              {retryCount >= 3 ? 'Max retries reached' : 'Try again'}
            </button>
          )}
          
          {retryCount > 0 && retryCount < 3 && (
            <p className="text-github-muted text-xs mt-1">
              Attempt {retryCount + 1} of 3
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;