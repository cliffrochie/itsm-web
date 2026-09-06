export const officeKeys = {
  all: ['offices'] as const,
  lists: () => [...officeKeys.all, 'list'] as const,
};
