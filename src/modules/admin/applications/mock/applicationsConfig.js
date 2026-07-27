export const applicationStatusLabels = {
  new: 'New',
  reviewing: 'In Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

export const applicationsPageMeta = {
  title: 'Applications',
  description:
    'Review, organize, and track candidate applications across all open job listings.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Applications' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Applications' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'In Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export const sortOptions = [
  { value: 'submitted_desc', label: 'Recently Submitted' },
  { value: 'submitted_asc', label: 'Oldest Submitted' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'experience_desc', label: 'Most Experience' },
  { value: 'experience_asc', label: 'Least Experience' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'status_asc', label: 'Status' },
];

export const statusActionLabels = {
  reviewing: 'Mark as Reviewed',
  shortlisted: 'Shortlist',
  rejected: 'Reject',
  hired: 'Hire',
  new: 'Reset to New',
};
