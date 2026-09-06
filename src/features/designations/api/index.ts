import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import type { Designation } from '../types';
import type { ApiResponse } from '@/types/api';
import { designationKeys } from './query-keys';
export * from './query-keys';

export const designationsApi = {
  getAll: async (): Promise<Designation[]> => {
    const response = await api.get<ApiResponse<Designation[]>>('/designations');
    return response.data?.data || [];
  },
};

export const useDesignations = () => {
  return useQuery({
    queryKey: designationKeys.lists(),
    queryFn: () => designationsApi.getAll(),
  });
};

