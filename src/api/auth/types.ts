export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'manage';

export type ModulePermissions = Partial<Record<PermissionAction, boolean>>;

export type AuthPermissions = Record<string, ModulePermissions>;

export interface AuthRole {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status?: string;
  userCount?: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  role?: AuthRole | null;
  department?: string | null;
  status: string;
  accessScope?: string | null;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  tokenType: string;
  user: AuthUser;
  role?: AuthRole | null;
  permissions?: AuthPermissions | null;
}

export interface LoginResponse {
  data: LoginResponseData;
}

export interface CurrentUserResponseData {
  user: AuthUser;
  role?: AuthRole | null;
  permissions?: AuthPermissions | null;
}

export interface CurrentUserResponse {
  data: CurrentUserResponseData;
}

export interface LogoutResponse {
  data: {
    message: string;
  };
}
