import { api } from '@/lib/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type { User, UserFilterParams, PaginatedUsers, TotalUserRoleData } from '../types';
import { userKeys } from './query-keys';
export * from './query-keys';
import { toast } from 'sonner';

export const usersApi = {
  getAll: async (params?: UserFilterParams): Promise<PaginatedUsers | User[]> => {
    const response = await api.get('/users', { params });
    const envelope = response.data;
    if (envelope && Array.isArray(envelope.data)) {
      if (envelope.meta) {
        return {
          rows: envelope.data,
          pageCount: envelope.meta.last_page ?? 1,
          rowCount: envelope.meta.total ?? envelope.data.length,
        };
      }
      return envelope.data;
    }
    return envelope;
  },

  getById: async (id: string | number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data?.data ?? response.data;
  },

  getTotalUserRoles: async (): Promise<TotalUserRoleData> => {
    const queryParams = [
      'superAdmin',
      'admin',
      'serviceEngineer',
      'client',
    ];
    const response = await api.get(
      `/users/total-user-role/?totalUsers=true&${queryParams.map((a) => `${a}=true`).join('&')}`
    );
    return response.data?.data ?? response.data;
  },

  create: async (payload: Partial<User>): Promise<User> => {
    const response = await api.post('/users', payload);
    return response.data?.data ?? response.data;
  },

  update: async ({
    id,
    payload,
  }: {
    id: string | number;
    payload: Partial<User>;
  }): Promise<User> => {
    const response = await api.put(`/users/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  toggleStatus: async ({
    id,
    isActive,
  }: {
    id: string | number;
    isActive: boolean;
  }): Promise<User> => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data?.data ?? response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export const useUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id: string | number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useTotalUserRoles = () => {
  return useQuery({
    queryKey: userKeys.totalUserRoles(),
    queryFn: () => usersApi.getTotalUserRoles(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User created successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to create user.';
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      toast.success('User updated successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update user.';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User deleted successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to delete user.';
      toast.error(message);
    },
  });
};

