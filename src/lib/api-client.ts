import axios from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || Cookies.get('jwt');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Normalize legacy url prefixes that include "/api/" or "/api/v1/"
  if (config.url?.startsWith('/api/v1/')) {
    config.url = config.url.slice('/api/v1'.length);
  } else if (config.url?.startsWith('/api/')) {
    config.url = config.url.slice('/api'.length);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data ?? error;

    if (status === 401) {
      useAuthStore.getState().clearAuth();
      Cookies.remove('jwt');
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }

    if (status === 403) {
      toast.error(payload?.message ?? 'Access denied.');
    }

    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      toast.error(
        retryAfter
          ? `Too many requests. Try again in ${retryAfter} seconds.`
          : 'Too many requests. Please try again later.',
      );
    }

    if (status && status >= 500) {
      toast.error(payload?.message ?? 'A server error occurred.');
    }

    return Promise.reject(payload);
  },
);

export default api;
