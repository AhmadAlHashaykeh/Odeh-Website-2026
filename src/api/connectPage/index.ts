import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/connect-page';

export interface ConnectPageSetting {
  meta: Record<string, unknown>;
  hero: Record<string, unknown>;
  links: Array<Record<string, unknown>>;
  lastUpdated?: string | null;
}

export function show() {
  return apiClient.get<SingleResponse<ConnectPageSetting>>(BASE);
}

export function update(payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<ConnectPageSetting>>(BASE, payload);
}
