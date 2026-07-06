import { apiClient } from '../client';
import type { ListParams, PaginatedResponse, SingleResponse } from '../types';
import { buildQueryString } from '../utils';

const BASE = '/admin/seo';

export interface SeoPage {
  id: string;
  pageName: string;
  route: string;
  pageType: string;
  contentModule: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  seoStatus: string;
  lastUpdated?: string | null;
}

export function list(params: ListParams = {}) {
  return apiClient.get<PaginatedResponse<SeoPage>>(`${BASE}${buildQueryString(params)}`);
}

export function show(id: string) {
  return apiClient.get<SingleResponse<SeoPage>>(`${BASE}/${id}`);
}

export function update(id: string, payload: Record<string, unknown>) {
  return apiClient.patch<SingleResponse<SeoPage>>(`${BASE}/${id}`, payload);
}
