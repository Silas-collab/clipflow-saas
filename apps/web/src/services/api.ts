import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to get token from Zustand persist storage
const getStoredToken = (): string | null => {
  try {
    const stored = localStorage.getItem('clipflow-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.token || null;
    }
  } catch (e) {
    console.error('Error reading token from storage:', e);
  }
  return null;
};

// Add auth token from localStorage on init
const token = getStoredToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor to add token dynamically
api.interceptors.request.use(
  (config) => {
    const currentToken = getStoredToken();
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the auth state
      localStorage.removeItem('clipflow-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
