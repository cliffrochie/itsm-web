import { api } from '@/lib/api-client';
import type { RegisterPayload } from '../types';

export const register = async (payload: RegisterPayload) => {
  const response = await api.post('/users/signup', payload);
  return response.data;
};
