export interface INotification {
  id?: number;
  _id?: string;
  userId?: number | string;
  user?: string;
  ticketId?: number | null;
  serviceTicket?: string;
  ticketNo?: string;
  title?: string;
  message: string;
  isRead: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
