import { IUser } from "./user";
import { IClient } from "./client";
import { IServiceTicketHistory } from "./service-ticket-history";

export type ServiceTicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "cancelled"
  | "assigned"
  | "in progress"
  | "on hold"
  | "escalated"
  | "canceled"
  | "reopened"
  | "";

export type ServiceTicketPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"
  | "";

export interface IServiceTicket {
  id?: number;
  _id?: string;
  ticketNo: string;
  taskType: string;
  title: string;
  natureOfWork?: string | null;
  serialNo?: string | null;
  equipmentType?: string | null;
  equipmentTypeOthers?: string | null;
  defectsFound?: string | null;
  serviceRendered?: string | null;
  serviceStatus?: ServiceTicketStatus;
  priority: ServiceTicketPriority;
  remarks?: string | null;
  adminRemarks?: string | null;
  rating?: number | string | null;
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
