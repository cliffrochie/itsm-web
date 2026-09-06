export interface IServiceTicketHistory {
  id?: number;
  _id?: string;
  serviceTicketId?: number;
  serviceTicket?: string;
  date?: string;
  time?: string;
  action?: string;
  notes?: string | null;
  details?: string;
  remarks?: string | null;
  performedById?: number | null;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
