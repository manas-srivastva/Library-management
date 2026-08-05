/**
 * API service modules.
 *
 * These are thin wrappers around the configured Axios instance. They are NOT
 * backed by a real server yet — pages currently consume local placeholder
 * data. When the backend is ready, replace the placeholder imports in each
 * page with calls to these functions, e.g.:
 *
 *   // before (placeholder)
 *   const books = placeholderBooks;
 *   // after (real backend)
 *   const { data } = await bookApi.list();
 *
 * No backend code is generated here — only typed HTTP call definitions.
 */
import api from './client';

export const bookApi = {
  list: (params?: Record<string, unknown>) => api.get('/books', { params }),
  get: (id: string) => api.get(`/books/${id}`),
  create: (payload: Record<string, unknown>) => api.post('/books', payload),
  update: (id: string, payload: Record<string, unknown>) => api.put(`/books/${id}`, payload),
  remove: (id: string) => api.delete(`/books/${id}`),
};

export const copyApi = {
  list: (params?: Record<string, unknown>) => api.get('/copies', { params }),
  get: (id: string) => api.get(`/copies/${id}`),
  create: (payload: Record<string, unknown>) => api.post('/copies', payload),
  update: (id: string, payload: Record<string, unknown>) => api.put(`/copies/${id}`, payload),
};

export const borrowApi = {
  list: (params?: Record<string, unknown>) => api.get('/borrows', { params }),
  issue: (payload: Record<string, unknown>) => api.post('/borrows', payload),
  return: (id: string) => api.post(`/borrows/${id}/return`),
};

export const reservationApi = {
  list: (params?: Record<string, unknown>) => api.get('/reservations', { params }),
  reserve: (payload: Record<string, unknown>) => api.post('/reservations', payload),
  cancel: (id: string) => api.post(`/reservations/${id}/cancel`),
};

export const fineApi = {
  list: (params?: Record<string, unknown>) => api.get('/fines', { params }),
  pay: (id: string) => api.post(`/fines/${id}/pay`),
  waive: (id: string) => api.post(`/fines/${id}/waive`),
};

export const analyticsApi = {
  overview: () => api.get('/analytics/overview'),
  monthlyBorrows: () => api.get('/analytics/monthly-borrows'),
  popularBooks: () => api.get('/analytics/popular-books'),
  activeMembers: () => api.get('/analytics/active-members'),
};

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload),
  register: (payload: { name: string; email: string; password: string }) =>
    api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
};
