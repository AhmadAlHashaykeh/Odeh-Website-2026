import { Navigate } from 'react-router-dom';
import { useModulePermissions } from '../hooks/useModulePermissions';
import AccessDeniedPage from '../pages/AccessDeniedPage';

export default function ModulePermissionRoute({ moduleId, children }) {
  const { canView } = useModulePermissions(moduleId);

  if (!canView) {
    return <AccessDeniedPage moduleId={moduleId} />;
  }

  return children;
}

export function ModulePermissionRedirect({ moduleId }) {
  const { canView } = useModulePermissions(moduleId);

  if (!canView) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return null;
}
