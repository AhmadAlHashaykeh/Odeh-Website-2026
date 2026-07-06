import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';

const NAV_MODULE_MAP = {
  careers: 'jobs',
};

export function resolvePermissionModule(moduleOrNavId) {
  return NAV_MODULE_MAP[moduleOrNavId] ?? moduleOrNavId;
}

export function useModulePermissions(moduleOrNavId) {
  const { permissions, role } = useAuth();
  const moduleId = resolvePermissionModule(moduleOrNavId);
  const isSuperAdmin = role?.slug === 'super-admin';

  return useMemo(() => {
    const modulePermissions = permissions?.[moduleId] ?? {};

    const canView = isSuperAdmin || modulePermissions.view === true;
    const canCreate = isSuperAdmin || modulePermissions.create === true;
    const canEdit = isSuperAdmin || modulePermissions.edit === true;
    const canDelete = isSuperAdmin || modulePermissions.delete === true;

    return {
      moduleId,
      isSuperAdmin,
      canView,
      canCreate,
      canEdit,
      canDelete,
    };
  }, [permissions, moduleId, isSuperAdmin]);
}

export function useCanViewModule(moduleOrNavId) {
  return useModulePermissions(moduleOrNavId).canView;
}
