export const teamCategoriesPageMeta = {
  title: 'Team Categories',
  description: 'Manage team directory groups, border colours, and public display order.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Categories' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Categories' },
  ],
  primaryAction: { label: 'Add Category', icon: 'add' },
  secondaryActions: [],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Display Order' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
];

export const bulkActionOptions = [
  { value: 'activate', label: 'Activate Selected' },
  { value: 'deactivate', label: 'Deactivate Selected' },
  { value: 'delete', label: 'Delete Selected' },
];
