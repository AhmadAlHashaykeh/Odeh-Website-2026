import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/about-pages';

export interface AboutPagesSetting {
  overview: Record<string, unknown>;
  approach: Record<string, unknown>;
  history: Record<string, unknown>;
  team: Record<string, unknown>;
  activities: Record<string, unknown>;
  lastUpdated?: string | null;
}

export function show() {
  return apiClient.get<SingleResponse<AboutPagesSetting>>(BASE);
}

export function update(payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<AboutPagesSetting>>(BASE, payload);
}
