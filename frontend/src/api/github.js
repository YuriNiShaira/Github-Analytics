import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

let cancelTokenSource = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  // ✅ Don't throw on 204 status
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 204 is included
  }
});

export const fetchGithubUser = async (username) => {
  // Cancel any ongoing request
  if (cancelTokenSource) {
    cancelTokenSource.cancel('Request canceled by new search');
  }
  
  cancelTokenSource = axios.CancelToken.source();
  
  try {
    const response = await api.get(`/github/${username}/`, {
      cancelToken: cancelTokenSource.token,
    });
    
    // ✅ If 204 No Content, return empty object
    if (response.status === 204) {
      return {};
    }
    
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return {};
    }
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 404) {
        throw new Error(data.error || `User "${username}" not found on GitHub. Please check the username.`);
      }
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      throw new Error(`Request failed with status ${status}`);
    } else if (error.request) {
      throw new Error('Network Error - No response from server');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  } finally {
    cancelTokenSource = null;
  }
};

export default api;