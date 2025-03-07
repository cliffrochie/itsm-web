
export interface INotification extends Document {
  _id: string
  user: string
  serviceTicket: string
  ticketNo: string
  message: string
  isRead: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}


