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
    const response = await api.get('/service-tickets', { params });
    const envelope = response.data;
    if (envelope && Array.isArray(envelope.data)) {
      return {
        rows: envelope.data,
        pageCount: envelope.meta?.last_page ?? 1,
        rowCount: envelope.meta?.total ?? envelope.data.length,
      };
    }
    return envelope;
  },

  getById: async (id: string | number): Promise<ServiceTicket> => {
    const response = await api.get(`/service-tickets/${id}`);
    return response.data?.data ?? response.data;
  },

  getRequested: async (): Promise<ServiceTicket[]> => {
    const response = await api.get('/service-tickets', {
      params: { serviceStatus: 'open', limit: 50 },
    });
    return response.data?.data ?? response.data?.results ?? [];
  },

  getAssigned: async (userId?: string | number): Promise<ServiceTicket[]> => {
    const response = await api.get('/service-tickets', {
      params: {
        serviceEngineerId: userId,
        limit: 50,
      },
    });
    return response.data?.data ?? response.data?.results ?? [];
  },

  create: async (payload: Partial<ServiceTicket> | TicketFormValues): Promise<ServiceTicket> => {
    const response = await api.post('/service-tickets', payload);
    return response.data?.data ?? response.data;
  },

  update: async ({
    id,
    payload,
  }: {
    id: string | number;
    payload: Partial<ServiceTicket>;
  }): Promise<ServiceTicket> => {
    const response = await api.put(`/service-tickets/${id}`, payload);
    return response.data?.data ?? response.data;
  },

  updateStatus: async ({
    id,
    serviceStatus,
    notes,
  }: {
    id: string | number;
    serviceStatus: string;
    notes?: string | null;
  }): Promise<ServiceTicket> => {
    const response = await api.patch(`/service-tickets/${id}/status`, {
      serviceStatus,
      notes,
    });
    return response.data?.data ?? response.data;
  },

  assignEngineer: async ({
    id,
    serviceEngineerId,
    notes,
  }: {
    id: string | number;
    serviceEngineerId: number;
    notes?: string | null;
  }): Promise<ServiceTicket> => {
    const response = await api.patch(`/service-tickets/${id}/assign`, {
      serviceEngineerId,
      notes,
    });
    return response.data?.data ?? response.data;
  },

  submitFeedback: async ({
    id,
    rating,
    ratingComment,
  }: {
    id: string | number;
    rating: number;
    ratingComment?: string | null;
  }): Promise<ServiceTicket> => {
    const response = await api.post(`/service-tickets/${id}/feedback`, {
      rating,
      ratingComment,
    });
    return response.data?.data ?? response.data;
  },

  delete: async (id: string | number): Promise<void> => {
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

export const useTicket = (id: string | number) => {
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

export const useAssignedTickets = (userId?: string | number) => {
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

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.updateStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      toast.success('Ticket status updated successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update ticket status.';
      toast.error(message);
    },
  });
};

export const useAssignEngineer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.assignEngineer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      toast.success('Engineer assigned successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to assign engineer.';
      toast.error(message);
    },
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.submitFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      toast.success('Feedback submitted successfully.');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to submit feedback.';
      toast.error(message);
    },
  });
};
