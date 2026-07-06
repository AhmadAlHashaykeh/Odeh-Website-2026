import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/admin/legal-pages';

export interface LegalPage {
  id: string;
  slug: string;
  path: string;
  title: string;
  hero: Record<string, unknown>;
  meta?: Record<string, unknown> | null;
  sections: Array<Record<string, unknown>>;
  body: Array<Record<string, unknown>>;
  lastUpdated?: string | null;
  publicationStatus: string;
}

export function list() {
  return apiClient.get<LegalPage[]>(BASE);
}

export function show(slug: string) {
  return apiClient.get<SingleResponse<LegalPage>>(`${BASE}/${slug}`);
}

export function update(slug: string, payload: Record<string, unknown>) {
  return apiClient.put<SingleResponse<LegalPage>>(`${BASE}/${slug}`, payload);
}
