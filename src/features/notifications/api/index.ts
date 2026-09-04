import { api } from '@/lib/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type { Notification } from '../types';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications', {
      params: { limit: 50 },
    });
    return response.data?.data || response.data || [];
  },

  getByUserId: async (_userId?: string | number): Promise<Notification[]> => {
    return notificationsApi.getAll();
  },

  markAsRead: async (id: string | number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  clearAll: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};

export const useNotifications = (userId?: string | number) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationsApi.getAll(),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useClearNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
