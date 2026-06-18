import { useState, useCallback } from 'react';
import { fetchGithubUser } from '../api/github';

export const useGithubData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (searchUsername) => {
    if (!searchUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setUsername(searchUsername);
    setRetryCount(0);

    try {
      const result = await fetchGithubUser(searchUsername.trim());
      
      // ✅ If result is empty (204 No Content), it means client disconnected
      // Just return without showing any error
      if (result === null || (typeof result === 'object' && Object.keys(result).length === 0)) {
        console.log('Request was canceled or client disconnected');
        return;
      }
      
      setData(result);
      setError(null);
    } catch (err) {
      // ✅ Check if it's a user not found error
      if (err.message && err.message.toLowerCase().includes('not found')) {
        setError(`User "${searchUsername}" not found on GitHub. Please check the username.`);
      } 
      // ✅ Check if it's a rate limit error
      else if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setError('GitHub API rate limit reached. Please wait a moment and try again.');
      }
      // ✅ Check if it's a network error
      else if (err.message === 'Network Error' || err.code === 'ECONNABORTED' || err.message?.includes('network')) {
        setError('Network error. Please check your internet connection and try again.');
      }
      // ✅ Check if it's a server error (500)
      else if (err.message && err.message.toLowerCase().includes('server')) {
        setError('Server error. Please try again in a moment.');
      }
      // ✅ Check if request was canceled
      else if (err.message === 'canceled' || err.message === 'aborted' || err.name === 'AbortError') {
        console.log('Request was canceled');
        return;
      }
      // ✅ Default error
      else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (username) {
      setRetryCount(prev => prev + 1);
      fetchData(username);
    }
  }, [username, fetchData]);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setUsername('');
    setRetryCount(0);
  }, []);

  return {
    data,
    loading,
    error,
    username,
    retryCount,
    fetchData,
    retry,
    clearData,
  };
};