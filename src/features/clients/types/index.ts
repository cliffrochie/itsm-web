import type { IDesignation } from '@/@types/designation';
import type { IOffice } from '@/@types/office';

export interface Client {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  contactNo?: string;
  email?: string;
  designation: IDesignation | string | null;
  office: IOffice | string | null;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ClientFilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  noPage?: boolean;
}

export interface PaginatedClients {
  rows: Client[];
  pageCount: number;
  rowCount: number;
}
