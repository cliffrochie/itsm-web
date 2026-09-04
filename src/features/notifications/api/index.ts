import { api } from '@/lib/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type { Notification } from '../types';

export const notificationsApi = {
  getByUserId: async (userId: string): Promise<Notification[]> => {
    const { data } = await api.get(
      `/notifications?userId=${userId}&noPage=true&sort=-createdAt&isRead=false`,
    );
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  clearAll: async (userId: string): Promise<void> => {
    await api.put(`/notifications/clear-user-notifications/${userId}`);
  },
};

export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => (userId ? notificationsApi.getByUserId(userId) : Promise.resolve([])),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useClearNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.clearAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
