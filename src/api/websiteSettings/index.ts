import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/website-settings';

export interface WebsiteSettings {
  general: Record<string, unknown>;
  branding: Record<string, unknown>;
  search: Record<string, unknown>;
  integrations: Record<string, unknown>;
  lastUpdated?: string | null;
}

export function show() {
  return apiClient.get<SingleResponse<WebsiteSettings>>(BASE);
}

export function update(payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<WebsiteSettings>>(BASE, payload);
}

export function updateSection(section: string, payload: Record<string, unknown>) {
  return apiClient.patch<SingleResponse<WebsiteSettings>>(`${BASE}/${section}`, payload);
}
