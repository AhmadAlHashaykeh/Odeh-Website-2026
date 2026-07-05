import { createContext, useContext, useMemo, useState } from 'react';

const defaultBreadcrumbs = [
  { label: 'Admin', path: '/admin/dashboard' },
  { label: 'Dashboard' },
];

const AdminBreadcrumbContext = createContext({
  breadcrumbs: defaultBreadcrumbs,
  setBreadcrumbs: () => {},
});

export function AdminBreadcrumbProvider({ children }) {
  const [breadcrumbs, setBreadcrumbs] = useState(defaultBreadcrumbs);

  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs }),
    [breadcrumbs],
  );

  return (
    <AdminBreadcrumbContext.Provider value={value}>
      {children}
    </AdminBreadcrumbContext.Provider>
  );
}

export function useAdminBreadcrumbContext() {
  return useContext(AdminBreadcrumbContext);
}

export { defaultBreadcrumbs };
