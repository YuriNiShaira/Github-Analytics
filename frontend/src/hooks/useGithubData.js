import { useState, useCallback } from 'react';
import { fetchGithubUser } from '../api/github';

export const useGithubData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const fetchData = useCallback(async (searchUsername) => {
    if (!searchUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError(null);
    setUsername(searchUsername);

    try {
      const result = await fetchGithubUser(searchUsername.trim());
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setUsername('');
  }, []);

  return {
    data,
    loading,
    error,
    username,
    fetchData,
    clearData,
  };
};