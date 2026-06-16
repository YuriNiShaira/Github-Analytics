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
      setData(result);
      setError(null);
    } catch (err) {
      setData(null);
      setError(err.message);
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