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
    response?: { data?: { message?: string }; status?: number };
    message?: string;
  };

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

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