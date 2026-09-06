import type { AuthUser, UserRole } from '@/types/auth';

export type User = AuthUser;

export interface UserFilterParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  noPage?: boolean;
}

export interface PaginatedUsers {
  rows: User[];
  pageCount: number;
  rowCount: number;
}

export interface TotalUserRoleData {
  total?: number;
  totalUsers?: number;
  superAdmin?: number;
  admin?: number;
  serviceEngineer?: number;
  client?: number;
  totalAdmin?: number;
  totalStaff?: number;
  totalUser?: number;
}

export type IUser = User;

