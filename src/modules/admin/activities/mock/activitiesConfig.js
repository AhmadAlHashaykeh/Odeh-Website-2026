export const activitiesPageMeta = {
  title: 'Activities',
  description:
    'Manage company events, visits, exhibitions, conferences and public activities.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Activities' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Activities' },
  ],
  primaryAction: { label: 'Add Activity', icon: 'add' },
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

export const featuredFilterOptions = [
  { value: 'all', label: 'All Activities' },
  { value: 'featured', label: 'Featured Only' },
  { value: 'not-featured', label: 'Not Featured' },
];

export const gallerySizeFilterOptions = [
  { value: 'all', label: 'All Galleries' },
  { value: 'small', label: 'Small (1–3)' },
  { value: 'medium', label: 'Medium (4–7)' },
  { value: 'large', label: 'Large (8+)' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Display Order' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Oldest Updated' },
  { value: 'date_desc', label: 'Newest Activity' },
  { value: 'date_asc', label: 'Oldest Activity' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
  { value: 'gallery_desc', label: 'Largest Gallery' },
];

export const bulkActionOptions = [
  { value: 'publish', label: 'Publish Selected' },
  { value: 'unpublish', label: 'Unpublish Selected' },
  { value: 'feature', label: 'Feature Selected' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'export', label: 'Export Selected' },
];
