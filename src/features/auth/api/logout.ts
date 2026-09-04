import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';

export const logout = async () => {
  try {
    await api.delete('/auth/logout');
  } catch {
    // Ignore error if logout fails on server
  } finally {
    useAuthStore.getState().clearAuth();
    Cookies.remove('jwt');
    Cookies.remove('token');
  }
};
