export const notificationKeys = {
  all: ['notifications'] as const,
  list: (userId?: string | number) => [...notificationKeys.all, userId] as const,
};
