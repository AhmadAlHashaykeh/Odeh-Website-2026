import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/roles';

export interface AdminRole {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  userCount?: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<AdminRole>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<AdminRole>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<AdminRole>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<AdminRole>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
