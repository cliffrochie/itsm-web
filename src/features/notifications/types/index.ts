export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  serviceTicketId?: string;
  ticketNo?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}
