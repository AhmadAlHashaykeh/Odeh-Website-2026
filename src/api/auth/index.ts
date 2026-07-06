import { apiClient, setStoredToken } from '../client';
import type {
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
} from './types';

export * from './types';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload, { auth: false });
  setStoredToken(response.data.token);
  return response;
}

export async function logout(): Promise<LogoutResponse> {
  return apiClient.post<LogoutResponse>('/auth/logout');
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return apiClient.get<CurrentUserResponse>('/auth/user');
}
