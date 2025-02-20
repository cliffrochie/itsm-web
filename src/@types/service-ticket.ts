import { IUser } from "./user"
import { IClient } from "./client"

export interface IServiceTicket {
  _id: string
  ticketNo: string
  date?: Date | string
  time?: string
  taskType: "" | "incident" | "service request" | "asset request" | "maintenance"  | "consultation" | "accessibility"
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


export function isServiceTicketInterface(obj: any): obj is IUser {
  // console.log(obj)
  return (
    obj && 
    typeof obj._id === 'string' &&
    typeof (obj.ticketNo === 'string' || obj.avatar === null || obj.avatar === '') &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    typeof (obj.password === 'string' || obj.password === null || obj.password === '') &&
    typeof obj.firstName === 'string' &&
    typeof (obj.middleName === 'string' || obj.middleName === null || obj.middleName === '') &&
    typeof obj.lastName === 'string' &&
    typeof (obj.extensionName === 'string' || obj.extensionName === null || obj.extensionName === '') &&
    typeof (obj.contactNo === 'string' || obj.contactNo === null || obj.contactNo === '') &&
    typeof (obj.role === 'string' || obj.role === null || obj.role === '') &&
    typeof (obj.createdBy === 'string' || obj.createdBy === null || obj.createdBy === '') && 
    typeof (obj.updatedBy === 'string' || obj.updatedBy === null || obj.updatedBy === '') &&
    typeof (obj.createdAt === 'object' || obj.createdAt === null || obj.createdAt === '') &&
    typeof (obj.updatedAt === 'object' || obj.updatedAt === null || obj.updatedAt === '')
  )
}