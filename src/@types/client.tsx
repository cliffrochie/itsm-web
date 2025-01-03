import { IDesignation } from './designation'
import { IOffice } from './office'

export interface IClient {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  extensionName?: string
  designation: string | IDesignation
  office: string | IOffice
  createdBy: string
  updatedBy: string
  createdAt?: Date
  updatedAt?: Date
}

