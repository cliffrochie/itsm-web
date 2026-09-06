export type UserRole = 'admin' | 'service_engineer' | 'staff' | 'user';

export interface AuthUser {
  id: number | string;
  _id?: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  contactNo?: string | null;
  role: UserRole;
  isActive?: boolean;
  avatar?: string | null;
}
