import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/project-categories';

export interface ProjectCategory {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  featuredImage?: string | null;
  status: string;
  published: boolean;
  publicationStatus: string;
  displayOrder: number;
  projectCount: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<ProjectCategory>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<ProjectCategory>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<ProjectCategory>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<ProjectCategory>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
