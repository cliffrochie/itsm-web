import type { IDesignation } from '@/@types/designation';
import type { IOffice } from '@/@types/office';
import type { ApiMeta } from '@/types/api';

export interface Client {
  id: number;
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

export interface ClientFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  email?: string;
  officeId?: number;
  designationId?: number;
  userId?: number;
}

export interface PaginatedClients {
  rows: Client[];
  pageCount: number;
  rowCount: number;
  meta?: ApiMeta;
}
