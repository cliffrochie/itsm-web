import type { IUser } from '@/@types/user';
import type { IClient } from '@/@types/client';

export type TaskType =
  | ''
  | 'incident'
  | 'service request'
  | 'maintenance'
  | 'consultation'
  | 'accessibility';

export type EquipmentType =
  | ''
  | 'computer'
  | 'software application'
  | 'printer'
  | 'scanner'
  | 'phone'
  | 'network'
  | 'others';

export type ServiceStatus =
  | ''
  | 'open'
  | 'assigned'
  | 'in progress'
  | 'on hold'
  | 'escalated'
  | 'canceled'
  | 'reopened'
  | 'resolved'
  | 'closed';

export type TicketPriority = '' | 'low' | 'medium' | 'high';
export type TicketRating = '' | 'n' | 's' | 'vs' | 'd' | 'vd';

export interface ServiceTicket {
  _id: string;
  ticketNo: string;
  taskType: TaskType;
  title: string;
  natureOfWork: string;
  serialNo?: string;
  equipmentType: EquipmentType;
  equipmentTypeOthers?: string;
  defectsFound?: string;
  serviceRendered?: string;
  serviceStatus?: ServiceStatus;
  priority: TicketPriority;
  remarks?: string;
  adminRemarks?: string;
  rating?: TicketRating;
  ratingComment?: string;
  serviceEngineer: IUser | string | null;
  client: IClient | string | null;
  createdBy?: IUser | string | null;
  updatedBy?: IUser | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TicketFilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
  taskType?: string;
  equipmentType?: string;
  serviceEngineer?: string;
  client?: string;
}

export interface PaginatedTickets {
  rows: ServiceTicket[];
  pageCount: number;
  rowCount: number;
}
