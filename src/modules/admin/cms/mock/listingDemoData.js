/**
 * Generic demo data for the CMS listing framework preview.
 * Not tied to any specific module — replace with module data in future phases.
 */

export const listingDemoMeta = {
  title: 'Content Items',
  description: 'Manage and organize your content entries across the CMS.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'CMS Framework' },
    { label: 'Content Items' },
  ],
  primaryAction: { label: 'Add Item', icon: 'add' },
  secondaryActions: [
    { label: 'Export', icon: 'export' },
    { label: 'Import', icon: 'upload' },
  ],
};

export const listingDemoItems = [
  { id: '1', title: 'Content Entry Alpha', subtitle: 'Primary showcase item for the listing framework', category: 'Group A', status: 'published', updatedAt: '2026-07-05T10:00:00' },
  { id: '2', title: 'Content Entry Beta', subtitle: 'Secondary item with draft status', category: 'Group B', status: 'draft', updatedAt: '2026-07-04T14:30:00' },
  { id: '3', title: 'Content Entry Gamma', subtitle: 'Archived reference material', category: 'Group A', status: 'archived', updatedAt: '2026-06-28T09:15:00' },
  { id: '4', title: 'Content Entry Delta', subtitle: 'Recently updated published entry', category: 'Group C', status: 'published', updatedAt: '2026-07-03T16:45:00' },
  { id: '5', title: 'Content Entry Epsilon', subtitle: 'Draft awaiting review', category: 'Group B', status: 'draft', updatedAt: '2026-07-02T11:20:00' },
  { id: '6', title: 'Content Entry Zeta', subtitle: 'Published with extended metadata', category: 'Group C', status: 'published', updatedAt: '2026-07-01T08:00:00' },
  { id: '7', title: 'Content Entry Eta', subtitle: 'Standard content record', category: 'Group A', status: 'published', updatedAt: '2026-06-30T13:10:00' },
  { id: '8', title: 'Content Entry Theta', subtitle: 'Legacy archived content', category: 'Group D', status: 'archived', updatedAt: '2026-06-15T17:00:00' },
  { id: '9', title: 'Content Entry Iota', subtitle: 'New draft in progress', category: 'Group D', status: 'draft', updatedAt: '2026-07-05T07:30:00' },
  { id: '10', title: 'Content Entry Kappa', subtitle: 'Published editorial content', category: 'Group B', status: 'published', updatedAt: '2026-06-29T12:00:00' },
  { id: '11', title: 'Content Entry Lambda', subtitle: 'Supplementary reference item', category: 'Group C', status: 'published', updatedAt: '2026-06-27T15:45:00' },
  { id: '12', title: 'Content Entry Mu', subtitle: 'Archived historical record', category: 'Group A', status: 'archived', updatedAt: '2026-05-20T10:30:00' },
];

export const listingDemoColumns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'updatedAt', label: 'Last Updated', type: 'date' },
];

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export const sortOptions = [
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
];

export const bulkActionOptions = [
  { value: 'publish', label: 'Publish Selected' },
  { value: 'archive', label: 'Archive Selected' },
  { value: 'delete', label: 'Delete Selected' },
];
