import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';

export const logout = async () => {
  try {
    await api.post('/users/signout');
  } catch {
    // Ignore error if signout fails on server
  } finally {
    useAuthStore.getState().clearAuth();
    Cookies.remove('jwt');
    Cookies.remove('token');
  }
};
