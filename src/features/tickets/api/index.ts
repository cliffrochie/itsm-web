import { api } from '@/lib/api-client';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import type {
  ServiceTicket,
  TicketFilterParams,
  PaginatedTickets,
} from '../types';
import type { TicketFormValues } from '../schemas';
import { toast } from 'sonner';

export const ticketsApi = {
  getAll: async (params?: TicketFilterParams): Promise<PaginatedTickets> => {
    const { data } = await api.get('/service-tickets/', { params });
    return data;
  },

  getById: async (id: string): Promise<ServiceTicket> => {
    const { data } = await api.get(`/service-tickets/${id}`);
    return data;
  },

  getRequested: async (): Promise<ServiceTicket[]> => {
    const { data } = await api.get('/service-tickets/requested');
    return data;
  },

  getAssigned: async (userId?: string): Promise<ServiceTicket[]> => {
    const url = userId
      ? `/service-tickets/assigned?userId=${userId}`
      : '/service-tickets/assigned';
    const { data } = await api.get(url);
    return data;
  },

  create: async (payload: TicketFormValues): Promise<ServiceTicket> => {
    const { data } = await api.post('/service-tickets', payload);
    return data;
  },

  update: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<ServiceTicket>;
  }): Promise<ServiceTicket> => {
    const { data } = await api.put(`/service-tickets/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/service-tickets/${id}`);
  },
};

export const useTickets = (params?: TicketFilterParams) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useRequestedTickets = () => {
  return useQuery({
    queryKey: ['tickets', 'requested'],
    queryFn: () => ticketsApi.getRequested(),
  });
};

export const useAssignedTickets = (userId?: string) => {
  return useQuery({
    queryKey: ['tickets', 'assigned', userId],
    queryFn: () => ticketsApi.getAssigned(userId),
    enabled: Boolean(userId),
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to create ticket.';
      toast.error(message);
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      toast.success('Ticket updated successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update ticket.';
      toast.error(message);
    },
  });
};
