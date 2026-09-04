import type { AuthUser, UserRole } from '@/types/auth';

export type User = AuthUser;

export interface UserFilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  role?: UserRole;
  noPage?: boolean;
}

export interface PaginatedUsers {
  rows: User[];
  pageCount: number;
  rowCount: number;
}
