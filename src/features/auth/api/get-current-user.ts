import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import type { AuthUser } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
  const user = response.data?.data;
  if (user) {
    useAuthStore.getState().setUser(user);
  }
  return user;
};
