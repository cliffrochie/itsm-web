import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import type { AuthUser } from '@/types/auth';

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get('/users/current-user');
  const user = response.data;
  if (user) {
    useAuthStore.getState().setUser(user);
  }
  return user;
};
