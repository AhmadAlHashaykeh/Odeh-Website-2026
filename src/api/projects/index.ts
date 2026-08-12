import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/projects';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  gallery?: Array<{ src: string; alt?: string }>;
  galleryCount?: number;
  location?: string | null;
  projectType?: string | null;
  area?: string | null;
  services?: string | null;
  completionStatus?: string | null;
  year?: number | null;
  status: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  category?: string | null;
  categorySlug?: string | null;
  projectCategoryId?: string | null;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<Project>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<Project>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<Project>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<Project>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
