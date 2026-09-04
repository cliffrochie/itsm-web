import { IDesignation } from "./designation";
import { IOffice } from "./office";

export interface IClient {
  id?: number;
  _id?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  contactNo?: string | null;
  email?: string | null;
  officeId?: number | null;
  designationId?: number | null;
  userId?: number | null;
  designation?: IDesignation | string | null;
  office?: IOffice | string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function isClientInterface(obj: any): obj is IClient {
  return (
    obj &&
    (typeof obj.id === "number" || typeof obj._id === "string") &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string"
  );
}
