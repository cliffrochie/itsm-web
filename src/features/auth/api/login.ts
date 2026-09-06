import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials, LoginResponse } from '../types';
import type { ApiResponse } from '@/types/api';
import type { AuthUser } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<{ token: string; user: AuthUser }>>(
    '/auth/login',
    credentials,
  );
  const payload = response.data?.data;

  const token = payload?.token || '';
  const user = payload?.user;

  if (token && user) {
    useAuthStore.getState().setAuth(token, user);
  }

  return {
    message: response.data?.message,
    token,
    user,
  };
};
