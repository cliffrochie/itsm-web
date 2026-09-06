export interface Notification {
  id?: number;
  _id?: string;
  userId: number | string;
  title: string;
  message: string;
  isRead: boolean;
  ticketId?: number | null;
  serviceTicketId?: string;
  ticketNo?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}
