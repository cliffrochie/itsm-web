export type UserRole = 'admin' | 'staff' | 'user';

export interface AuthUser {
  id: string;
  _id?: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  contactNo?: string;
  role: UserRole;
  isActive?: boolean;
  avatar?: string;
}
