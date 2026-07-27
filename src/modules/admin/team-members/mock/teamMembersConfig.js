export const teamMembersPageMeta = {
  title: 'Team Members',
  description:
    'Manage leadership profiles, team members, departments, and public directory visibility.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Members' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Team Members' },
  ],
  primaryAction: { label: 'Add Member', icon: 'add' },
  secondaryActions: [
    { label: 'Export Directory', icon: 'export' },
    { label: 'Import', icon: 'upload' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'hidden', label: 'Hidden' },
];

export const categoryFilterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'founders-executive-leadership', label: 'Founders & Executive Leadership' },
  { value: 'partners-directors', label: 'Partners & Directors' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'structural-engineering', label: 'Structural Engineering' },
  { value: 'architecture-design', label: 'Architecture & Design' },
  { value: 'mep-engineering', label: 'MEP Engineering' },
  { value: 'site-engineers', label: 'Site Engineers' },
  { value: 'administration-support', label: 'Administration & Support' },
  { value: 'other-team-members', label: 'Other Team Members' },
];

export const experienceFilterOptions = [
  { value: 'all', label: 'All Experience' },
  { value: '20+', label: '20+ Years' },
  { value: '10+', label: '10+ Years' },
  { value: '5+', label: '5+ Years' },
  { value: '3+', label: '3+ Years' },
  { value: '1+', label: '1+ Years' },
];

export const sortOptions = [
  { value: 'order_asc', label: 'Display Order' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Oldest Updated' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'experience_desc', label: 'Most Experience' },
  { value: 'experience_asc', label: 'Least Experience' },
];

export const bulkActionOptions = [
  { value: 'show', label: 'Show Selected' },
  { value: 'hide', label: 'Hide Selected' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'export', label: 'Export Selected' },
  { value: 'change-department', label: 'Change Department' },
];
