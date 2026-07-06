import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/jobs';

export interface Job {
  id: string;
  title: string;
  slug: string;
  department?: string | null;
  location?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  experienceLevel?: string | null;
  postedDate?: string | null;
  closingDate?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  responsibilitiesCount?: number;
  requirementsCount?: number;
  benefitsCount?: number;
  status: string;
  applicationsCount?: number;
  lastUpdated?: string | null;
  createdAt?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<Job>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<Job>>(`${BASE}/${id}`);
}

export function create(payload: Record<string, unknown>) {
  return apiClient.post<SingleResponse<Job>>(BASE, payload);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<Job>>(`${BASE}/${id}`, payload);
}

export function destroy(id: string) {
  return apiClient.delete<void>(`${BASE}/${id}`);
}
