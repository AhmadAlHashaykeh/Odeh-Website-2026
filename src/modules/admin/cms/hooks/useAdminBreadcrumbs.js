import { useEffect } from 'react';
import {
  defaultBreadcrumbs,
  useAdminBreadcrumbContext,
} from '../../context/AdminBreadcrumbContext';

export function useAdminBreadcrumbs(breadcrumbs) {
  const { setBreadcrumbs } = useAdminBreadcrumbContext();

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => setBreadcrumbs(defaultBreadcrumbs);
  }, [breadcrumbs, setBreadcrumbs]);
}
