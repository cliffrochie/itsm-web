

export interface IServiceTicketHistory {
  _id: string
  serviceTicket: string
  date: string
  time?: string
  details: string  
  remarks?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}