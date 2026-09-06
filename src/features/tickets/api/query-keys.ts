import type { TicketFilterParams } from '../types';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters?: TicketFilterParams) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...ticketKeys.details(), id] as const,
  requested: () => [...ticketKeys.all, 'requested'] as const,
  assigned: (userId?: string | number) => [...ticketKeys.all, 'assigned', userId] as const,
  closed: (userId?: string | number) => [...ticketKeys.all, 'closed', userId] as const,
  stats: () => [...ticketKeys.all, 'stats'] as const,
  totalServiceStatus: () => [...ticketKeys.stats(), 'service-status'] as const,
  totalTaskType: () => [...ticketKeys.stats(), 'task-type'] as const,
  totalEquipmentType: () => [...ticketKeys.stats(), 'equipment-type'] as const,
};
