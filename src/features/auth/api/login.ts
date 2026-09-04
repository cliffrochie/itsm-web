import { api } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials, LoginResponse } from '../types';
import type { AuthUser } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/users/signin', credentials);
  const data = response.data;

  // The backend might return token in response.data or via cookie
  const token = data?.token || (typeof data === 'string' ? data : '');
  
  // If user profile is included, set it immediately
  if (data?.user) {
    useAuthStore.getState().setAuth(token, data.user);
  } else if (data && typeof data === 'object' && 'role' in data) {
    useAuthStore.getState().setAuth(token, data as AuthUser);
  }

  return data;
};
