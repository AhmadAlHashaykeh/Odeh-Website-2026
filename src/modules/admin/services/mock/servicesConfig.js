export const servicesPageMeta = {
  title: 'Services',
  description:
    'Manage service cards, homepage visibility, ordering, and public service content.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Services' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Services' },
  ],
  primaryAction: { label: 'Add Service', icon: 'add' },
  secondaryActions: [
    { label: 'Export Services', icon: 'export' },
    { label: 'Reorder', icon: 'sort' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'draft', label: 'Draft' },
];

export const homepageFilterOptions = [
  { value: 'all', label: 'All Visibility' },
  { value: 'yes', label: 'On Homepage' },
  { value: 'no', label: 'Not on Homepage' },
];

export const seoFilterOptions = [
  { value: 'all', label: 'All SEO' },
  { value: 'complete', label: 'SEO Ready' },
  { value: 'pending', label: 'SEO Pending' },
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
  { value: 'hide', label: 'Hide Selected' },
  { value: 'add-homepage', label: 'Add to Homepage' },
  { value: 'remove-homepage', label: 'Remove from Homepage' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'export', label: 'Export Selected' },
];
