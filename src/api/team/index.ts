import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/team-members';

export interface TeamMember {
  id: string;
  slug: string;
  fullName: string;
  position?: string | null;
  department?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    borderColor: string;
    displayOrder: number;
    description?: string | null;
    isActive?: boolean;
  } | null;
  categoryLabel?: string | null;
  teamCategoryId?: string | null;
  experience?: string | null;
  experienceYears?: number | null;
  email?: string | null;
  photo?: string | null;
  status: string;
  displayOrder: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<TeamMember>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<TeamMember>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<TeamMember>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<TeamMember>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
