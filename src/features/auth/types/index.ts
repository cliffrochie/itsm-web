import type { AuthUser } from '@/types/auth';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  username: string;
  email: string;
  contactNo?: string | null;
  password: string;
  password2: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
  user?: AuthUser;
  role?: string;
  [key: string]: unknown;
}
