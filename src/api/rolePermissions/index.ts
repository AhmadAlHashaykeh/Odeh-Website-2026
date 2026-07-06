import { apiClient } from '../client';

const baseFor = (roleId: string) => `/admin/roles/${roleId}/permissions`;

export interface RolePermissionEntry {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function list(roleId: string) {
  return apiClient.get<RolePermissionEntry[]>(baseFor(roleId));
}

export function update(roleId: string, permissions: RolePermissionEntry[]) {
  return apiClient.put<RolePermissionEntry[]>(baseFor(roleId), { permissions });
}
