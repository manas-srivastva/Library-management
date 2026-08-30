import axios from "axios";
import { STORAGE_KEYS } from "@/constants/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getErrorMessage = (error: unknown) => {
  const err = error as {
    response?: { data?: { message?: string; errors?: Array<{ msg?: string }>; }; status?: number };
    message?: string;
  };

  // Validation errors from express-validator
  if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
    return err.response.data.errors.map(e => e.msg || 'Invalid input').join(', ');
  }

  // Server error message
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  // Network error
  if (err?.message?.includes('timeout')) {
    return 'Request timeout. Please check your connection and try again.';
  }

  // Generic error
  if (err?.message) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    error.userMessage = message;

    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;