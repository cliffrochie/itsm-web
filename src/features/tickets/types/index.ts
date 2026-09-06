import type { IUser } from '@/@types/user';
import type { IClient } from '@/@types/client';
import type { IServiceTicketHistory } from '@/@types/service-ticket-history';

export type TaskType =
  | ''
  | 'incident'
  | 'service request'
  | 'maintenance'
  | 'consultation'
  | 'accessibility'
  | string;

export type EquipmentType =
  | ''
  | 'computer'
  | 'software application'
  | 'printer'
  | 'scanner'
  | 'phone'
  | 'network'
  | 'others'
  | string;

export type ServiceStatus =
  | ''
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'cancelled'
  | 'assigned'
  | 'in progress'
  | 'on hold'
  | 'escalated'
  | 'canceled'
  | 'reopened'
  | string;

export type TicketPriority = '' | 'low' | 'medium' | 'high' | 'urgent' | string;
export type TicketRating = '' | number | 'n' | 's' | 'vs' | 'd' | 'vd';

export interface ServiceTicket {
  id?: number;
  _id?: string;
  ticketNo: string;
  taskType: TaskType;
  title: string;
  natureOfWork?: string | null;
  serialNo?: string | null;
  equipmentType?: EquipmentType;
  equipmentTypeOthers?: string | null;
  defectsFound?: string | null;
  serviceRendered?: string | null;
  serviceStatus?: ServiceStatus;
  priority: TicketPriority;
  remarks?: string | null;
  adminRemarks?: string | null;
  rating?: TicketRating | null;
  ratingComment?: string | null;
  clientId?: number | null;
  serviceEngineerId?: number | null;
  createdById?: number | null;
  updatedById?: number | null;
  serviceEngineer?: IUser | string | null;
  client?: IClient | string | null;
  createdBy?: IUser | string | null;
  updatedBy?: IUser | string | null;
  histories?: IServiceTicketHistory[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type PublicHistory = Omit<IServiceTicketHistory, 'notes'> & { notes?: string | null };

export type PublicTicket = Omit<ServiceTicket, 'adminRemarks'> & {
  adminRemarks?: string | null;
  histories?: PublicHistory[];
};

export interface TicketFilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  serviceStatus?: string;
  status?: string;
  priority?: string;
  taskType?: string;
  equipmentType?: string;
  serviceEngineer?: string;
  serviceEngineerId?: number | string;
  client?: string;
  clientId?: number | string;
}

export interface PaginatedTickets {
  rows: ServiceTicket[];
  pageCount: number;
  rowCount: number;
}

export interface TotalServiceStatusData {
  totalTickets: number;
  totalOpenedTickets: number;
  totalAssignedTickets: number;
  totalInProgressTickets: number;
  totalOnHoldTickets: number;
  totalEscalatedTickets: number;
  totalCanceledTickets: number;
  totalReOpenedTickets: number;
  totalResolvedTickets: number;
  totalClosedTickets: number;
}

export interface TotalTaskTypeData {
  incident: number;
  serviceRequest: number;
  maintenance: number;
  consultation: number;
  accessibility: number;
}

export interface TotalEquipmentTypeData {
  computer: number;
  softwareApplication: number;
  printer: number;
  scanner: number;
  phone: number;
  network: number;
  others: number;
}

export type IServiceTicket = ServiceTicket;


