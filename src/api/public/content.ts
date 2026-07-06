import { apiClient } from '../client';
import type { SingleResponse } from '../types';

const BASE = '/public';

export function getHome() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/home`, { auth: false });
}

export function getAbout() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/about`, { auth: false });
}

export function getNavigationFooter() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/navigation-footer`, {
    auth: false,
  });
}

export function getConnectPage() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/connect`, { auth: false });
}

export function getWebsiteSettings() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/website-settings`, {
    auth: false,
  });
}

export function getReachOutPage() {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/reach-out`, { auth: false });
}

export function getLegalPages() {
  return apiClient.get<{ data: Record<string, unknown>[] }>(`${BASE}/legal-pages`, { auth: false });
}

export function getLegalPage(slug: string) {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/legal-pages/${slug}`, {
    auth: false,
  });
}

export function getSeoByRoute(route: string) {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(
    `${BASE}/seo/by-route?route=${encodeURIComponent(route)}`,
    { auth: false },
  );
}

export function getProjects(params?: { featured?: boolean; category?: string }) {
  const search = new URLSearchParams();
  if (params?.featured) search.set('featured', '1');
  if (params?.category) search.set('category', params.category);
  const query = search.toString();

  return apiClient.get<{ data: Record<string, unknown> }>(
    `${BASE}/projects${query ? `?${query}` : ''}`,
    { auth: false },
  );
}

export function getProject(categorySlug: string, slug: string) {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(
    `${BASE}/projects/${categorySlug}/${slug}`,
    { auth: false },
  );
}

export function getServices(params?: { homepage?: boolean }) {
  const query = params?.homepage ? '?homepage=1' : '';

  return apiClient.get<{ data: Record<string, unknown>[] }>(`${BASE}/services${query}`, {
    auth: false,
  });
}

export function getActivities() {
  return apiClient.get<{ data: Record<string, unknown> }>(`${BASE}/activities`, { auth: false });
}

export function getActivity(slug: string) {
  return apiClient.get<{ data: Record<string, unknown> }>(`${BASE}/activities/${slug}`, {
    auth: false,
  });
}

export function getTeamMembers() {
  return apiClient.get<{ data: Record<string, unknown> }>(`${BASE}/team-members`, { auth: false });
}

export function getCareers() {
  return apiClient.get<{ data: Record<string, unknown> }>(`${BASE}/careers`, { auth: false });
}

export function getJob(slug: string) {
  return apiClient.get<SingleResponse<Record<string, unknown>>>(`${BASE}/jobs/${slug}`, {
    auth: false,
  });
}

export function searchContent(query: string, limit = 50) {
  return apiClient.get<{ data: Record<string, unknown>[] }>(
    `${BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    { auth: false },
  );
}

export function getSearchSuggestions(limit = 8) {
  return apiClient.get<{ data: Record<string, unknown>[] }>(
    `${BASE}/search/suggestions?limit=${limit}`,
    { auth: false },
  );
}
