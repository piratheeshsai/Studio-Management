import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    console.log('Backend connected:', response.config.baseURL);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Optional: window.location.href = '/login';
    }
    console.error('Backend connection error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
