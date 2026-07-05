export const categoriesPageMeta = {
  title: 'Project Categories',
  description: 'Organize and manage architectural portfolio categories.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Project Categories' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Project Categories' },
  ],
  primaryAction: { label: 'Add Category', icon: 'add' },
  secondaryActions: [
    { label: 'Reorder', icon: 'sort' },
    { label: 'Export', icon: 'export' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

export const seoFilterOptions = [
  { value: 'all', label: 'All SEO' },
  { value: 'complete', label: 'SEO Ready' },
  { value: 'pending', label: 'SEO Pending' },
];

export const projectCountFilterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'with-projects', label: 'With Projects' },
  { value: 'empty', label: 'Without Projects' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Display Order' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Oldest Updated' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
  { value: 'projects_desc', label: 'Most Projects' },
  { value: 'projects_asc', label: 'Fewest Projects' },
];

export const bulkActionOptions = [
  { value: 'publish', label: 'Publish Selected' },
  { value: 'hide', label: 'Hide Selected' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'export', label: 'Export Selected' },
];
