
export interface INotification extends Document {
  _id: string
  user: string
  message: string
  isRead: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}


