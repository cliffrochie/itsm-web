import type { ClientFilterParams } from '../types';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: ClientFilterParams) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...clientKeys.details(), id] as const,
};
