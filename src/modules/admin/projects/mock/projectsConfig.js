export const projectsPageMeta = {
  title: 'Projects',
  description: 'Manage projects — name, area, location, architect, and category.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Projects' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Projects' },
  ],
  primaryAction: { label: 'Add Project', icon: 'add' },
  secondaryActions: [
    { label: 'Export', icon: 'export' },
    { label: 'Import', icon: 'upload' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export const publishedFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Display Order' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Oldest Updated' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
];

export const bulkActionOptions = [
  { value: 'publish', label: 'Publish Selected' },
  { value: 'unpublish', label: 'Unpublish Selected' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'move-category', label: 'Move Category' },
  { value: 'export', label: 'Export Selected' },
];
