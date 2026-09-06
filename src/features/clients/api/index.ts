import { api } from '@/lib/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type { Client, ClientFilterParams, PaginatedClients } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { clientKeys } from './query-keys';
export * from './query-keys';
import { toast } from 'sonner';

export const clientsApi = {
  getAll: async (params?: ClientFilterParams): Promise<PaginatedClients> => {
    const response = await api.get<PaginatedResponse<Client>>('/clients', { params });
    return {
      rows: response.data?.data || [],
      pageCount: response.data?.meta?.last_page || 1,
      rowCount: response.data?.meta?.total || 0,
      meta: response.data?.meta,
    };
  },

  getById: async (id: number | string): Promise<Client> => {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data?.data;
  },

  create: async (payload: Partial<Client>): Promise<Client> => {
    const response = await api.post<ApiResponse<Client>>('/clients', payload);
    return response.data?.data;
  },

  update: async ({
    id,
    payload,
  }: {
    id: number | string;
    payload: Partial<Client>;
  }): Promise<Client> => {
    const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, payload);
    return response.data?.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

export const useClients = (params?: ClientFilterParams) => {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientsApi.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useClient = (id: number | string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Client created successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to create client.';
      toast.error(message);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
      toast.success('Client updated successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update client.';
      toast.error(message);
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Client deleted successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to delete client.';
      toast.error(message);
    },
  });
};

