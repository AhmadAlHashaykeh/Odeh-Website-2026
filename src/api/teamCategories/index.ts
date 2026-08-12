import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/team-categories';

export interface TeamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  borderColor: string;
  icon?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  displayOrder: number;
  isActive: boolean;
  status: string;
  membersCount: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<TeamCategory>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<TeamCategory>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<TeamCategory>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<TeamCategory>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}

export function reorder(orderedIds: string[]) {
  return apiClient.post<{ data: TeamCategory[] }>(`${BASE}/reorder`, { orderedIds });
}
