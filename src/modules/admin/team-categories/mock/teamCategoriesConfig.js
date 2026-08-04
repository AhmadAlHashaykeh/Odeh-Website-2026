export const teamCategoriesPageMeta = {
  title: 'Team Sections',
  description:
    'These sections group people on the public Team Members page (Board of Directors / Team Members).',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Sections' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Sections' },
  ],
  primaryAction: { label: 'Add Section', icon: 'add' },
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
