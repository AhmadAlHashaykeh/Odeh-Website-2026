import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/home-page';

export interface HomePageSetting {
  hero: Record<string, unknown>;
  about: Record<string, unknown>;
  services: Record<string, unknown>;
  projects: Record<string, unknown>;
  lastUpdated?: string | null;
}

export function show() {
  return apiClient.get<SingleResponse<HomePageSetting>>(BASE);
}

export function update(payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<HomePageSetting>>(BASE, payload);
}
