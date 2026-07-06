import { apiClient } from '../client';
import type { SingleResponse } from '../types';

export interface DashboardStats {
  projects: number;
  categories: number;
  teamMembers: number;
  services: number;
  activities: number;
  careers: number;
  applications: number;
  contactMessages: number;
  publicPages: number;
  seoComplete: number;
  seoPending: number;
}

export function getStats() {
  return apiClient.get<SingleResponse<DashboardStats>>('/admin/dashboard/stats');
}
