import { IDesignation } from './designation'
import { IOffice } from './office'

export interface IClient {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  extensionName?: string
  contactNo?: string
  email?: string
  designation: IDesignation | string | null
  office: IOffice | string | null
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}



export function isClientInterface(obj: any): obj is IClient {
  console.log(obj)
  return (
    obj &&
    typeof obj._id === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof (obj.middleName === 'string' || obj.middleName === null || obj.middleName === '') &&
    typeof obj.lastName === 'string' &&
    typeof (obj.extensionName === 'string' || obj.extensionName === null || obj.extensionName === '') &&
    typeof (obj.contactNo === 'string' || obj.contactNo === null || obj.contactNo === '') &&
    typeof (obj.designation === 'string' || obj.designation === null || obj.designation === '') &&
    typeof (obj.office === 'string' || obj.office === null || obj.office === '') &&
    typeof (obj.createdBy === 'string' || obj.createdBy === null || obj.createdBy === '') && 
    typeof (obj.updatedBy === 'string' || obj.updatedBy === null || obj.updatedBy === '') &&
    typeof (obj.createdAt === 'object' || obj.createdAt === null || obj.createdAt === '') &&
    typeof (obj.updatedAt === 'object' || obj.updatedAt === null || obj.updatedAt === '')
  )
}