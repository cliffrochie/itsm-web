import { z } from 'zod';

export const ticketFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  equipmentType: z.string().min(1, { message: 'Equipment type is required.' }),
  taskType: z.string().min(1, { message: 'Task type is required.' }),
  natureOfWork: z.string().min(1, { message: 'Nature of work is required.' }),
  client: z.string().min(1, { message: 'Client is required.' }),
  serialNo: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  serviceStatus: z.string().optional(),
  remarks: z.string().optional(),
  adminRemarks: z.string().optional(),
  serviceEngineer: z.string().nullable().optional(),
  clientId: z.number().optional().nullable(),
  serviceEngineerId: z.number().optional().nullable(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;

export const ticketResolutionSchema = z.object({
  defectsFound: z.string().min(1, { message: 'Defects found is required.' }),
  serviceRendered: z.string().min(1, { message: 'Service rendered is required.' }),
  serviceStatus: z.string().min(1, { message: 'Service status is required.' }),
  remarks: z.string().optional(),
});

export type TicketResolutionValues = z.infer<typeof ticketResolutionSchema>;

export const updateTicketStatusSchema = z.object({
  serviceStatus: z.enum(['open', 'in_progress', 'resolved', 'closed', 'cancelled']),
  notes: z.string().optional().nullable(),
});

export const assignEngineerSchema = z.object({
  serviceEngineerId: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});

export const ticketFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  ratingComment: z.string().optional().nullable(),
});

