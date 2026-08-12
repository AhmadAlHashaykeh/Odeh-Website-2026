export const teamMembersPageMeta = {
  title: 'Team Members',
  description:
    'Add and edit people shown on the website. Select members to move them between Board of Directors and Team Members in bulk.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Members' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Members' },
  ],
  primaryAction: { label: 'Add Member', icon: 'add' },
  secondaryActions: [],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All visibility' },
  { value: 'active', label: 'Visible on website' },
  { value: 'hidden', label: 'Hidden' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Website order' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'updated_desc', label: 'Recently updated' },
];

export const bulkActionOptions = [
  { value: 'show', label: 'Make visible' },
  { value: 'hide', label: 'Hide from website' },
  { value: 'move', label: 'Move to section…' },
  { value: 'delete', label: 'Delete' },
];
