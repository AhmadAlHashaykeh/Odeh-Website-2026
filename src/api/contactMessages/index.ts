import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/contact-messages';

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message?: string | null;
  status: string;
  priority: string;
  assignedUserId?: string | null;
  assignedUser?: { id: string; fullName: string; email: string } | null;
  adminNotes?: string | null;
  submittedAt?: string | null;
  lastUpdated?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<ContactMessage>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<ContactMessage>>(`${BASE}/${id}`);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.patch<SingleResponse<ContactMessage>>(`${BASE}/${id}`, payload);
}
