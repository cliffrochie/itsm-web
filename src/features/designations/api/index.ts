import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Designation } from '../types';

export const designationsApi = {
  getAll: async (): Promise<Designation[]> => {
    const { data } = await api.get('/designations');
    return data;
  },
};

export const useDesignations = () => {
  return useQuery({
    queryKey: ['designations'],
    queryFn: () => designationsApi.getAll(),
  });
};
