import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Office } from '../types';

export const officesApi = {
  getAll: async (): Promise<Office[]> => {
    const { data } = await api.get('/offices');
    return data;
  },
};

export const useOffices = () => {
  return useQuery({
    queryKey: ['offices'],
    queryFn: () => officesApi.getAll(),
  });
};
