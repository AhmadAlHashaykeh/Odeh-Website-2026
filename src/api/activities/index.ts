import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/activities';

export interface Activity {
  id: string;
  title: string;
  slug: string;
  location?: string | null;
  description?: string | null;
  descriptionPreview?: string | null;
  fullDescription?: string | null;
  coverImage?: string | null;
  gallery?: Array<{ src: string; alt?: string }>;
  galleryCount?: number;
  activityDate?: string | null;
  activityYear?: number | null;
  status: string;
  publicationStatus?: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<Activity>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<Activity>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<Activity>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<Activity>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
