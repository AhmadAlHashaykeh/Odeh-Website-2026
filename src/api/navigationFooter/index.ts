import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/navigation-footer';

export interface NavigationFooterSetting {
  logo: Record<string, unknown>;
  navigationItems: Array<Record<string, unknown>>;
  footerBrand: Record<string, unknown>;
  footerNavGroups: Array<Record<string, unknown>>;
  contact: Record<string, unknown>;
  socialLinks: Array<Record<string, unknown>>;
  copyright: Record<string, unknown>;
  lastUpdated?: string | null;
}

export function show() {
  return apiClient.get<SingleResponse<NavigationFooterSetting>>(BASE);
}

export function update(payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<NavigationFooterSetting>>(BASE, payload);
}
