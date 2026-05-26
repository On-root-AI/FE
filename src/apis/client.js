import axios from 'axios';

const ACCESS_TOKEN_STORAGE_KEY = 'onroot:accessToken';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function hasApiBaseUrl() {
  return Boolean(import.meta.env.VITE_API_BASE_URL);
}

function getStoredApiAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getApiAuthToken() {
  return getStoredApiAuthToken();
}

export function setApiAuthToken(token) {
  if (typeof window !== 'undefined') {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  }

  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredApiAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
