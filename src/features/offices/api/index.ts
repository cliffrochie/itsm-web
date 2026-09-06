import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Office } from '../types';
import type { ApiResponse } from '@/types/api';
import { officeKeys } from './query-keys';
export * from './query-keys';

export const officesApi = {
  getAll: async (): Promise<Office[]> => {
    const response = await api.get<ApiResponse<Office[]>>('/offices');
    return response.data?.data || [];
  },
};

export const useOffices = () => {
  return useQuery({
    queryKey: officeKeys.lists(),
    queryFn: () => officesApi.getAll(),
  });
};

