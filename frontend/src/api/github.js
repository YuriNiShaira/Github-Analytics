import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const fetchGithubUser = async (username) => {
  try {
    const response = await api.get(`/github/${username}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch user data');
    } else if (error.request) {
      throw new Error('No response from server. Please try again.');
    } else {
      throw new Error('An error occurred. Please try again.');
    }
  }
};

export default api;