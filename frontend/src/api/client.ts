import axios from 'axios';

/**
 * Pre-configured Axios instance.
 *
 * NOTE: The backend is not yet wired up. When ready, set VITE_API_URL in your
 * environment and all `api.*` calls will hit it. Until then, pages consume
 * local placeholder data directly — swapping to these calls later is trivial:
 *
 *   const { data } = await api.get('/books');
 *
 * No backend code lives in this project.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach auth token from localStorage when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('libraai-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors before they reach the UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || 'Unexpected network error';
    return Promise.reject(new Error(message));
  },
);

export default api;
