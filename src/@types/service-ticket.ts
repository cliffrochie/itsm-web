import { IUser } from "./user"
import { IClient } from "./client"

export interface IServiceTicket {
  _id: string
  ticketNo: string
  date?: Date | string
  time?: string
  taskType: "" | "incident" | "service request" | "asset request" | "maintenance"  | "consultation"
  natureOfWork: string
  serialNo?: string
  equipmentType: "" | "computer" | "software application" | "printer" | "phone" | "network" | "others"
  equipmentTypeOthers?: string
  defectsFound?: string
  serviceRendered?: string
  serviceStatus?: "" | "open" | "in progress" | "on hold" | "escalated" | "canceled" | "reopened" | "resolved" | "closed"
  priority: "" | "low" | "medium" | "high"
  remarks?: string
  serviceEngineer: IUser | string | null
  client: IClient | string | null
  createdBy?: IUser | string | null
  updatedBy?: IUser | string | null
  createdAt?: Date
  updatedAt?: Date
}