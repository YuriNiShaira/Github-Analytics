import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-400 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-github-accent hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;