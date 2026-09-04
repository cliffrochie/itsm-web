export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5500',
  IS_DEV: import.meta.env.DEV,
} as const;
