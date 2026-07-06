import { apiClient, downloadBlob } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/job-applications';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string | null;
  jobSlug?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  yearsOfExperience?: number | null;
  linkedinUrl?: string | null;
  coverLetter?: string | null;
  cvOriginalName?: string | null;
  cvSize?: number | null;
  status: string;
  adminNotes?: string | null;
  submittedAt?: string | null;
  lastUpdated?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<JobApplication>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<JobApplication>>(`${BASE}/${id}`);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.patch<SingleResponse<JobApplication>>(`${BASE}/${id}`, payload);
}

export function downloadCv(id: string, filename: string) {
  return downloadBlob(`${BASE}/${id}/cv`, filename);
}
