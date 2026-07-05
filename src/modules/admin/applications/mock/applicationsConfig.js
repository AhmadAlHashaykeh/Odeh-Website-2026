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
  secondaryActions: [
    { label: 'Export Applications', icon: 'export' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export const experienceFilterOptions = [
  { value: 'all', label: 'All Experience' },
  { value: '0-2', label: '0–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-10', label: '6–10 years' },
  { value: '10+', label: '10+ years' },
];

export const submittedDateFilterOptions = [
  { value: 'all', label: 'All Dates' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
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

export const bulkActionOptions = [
  { value: 'reviewed', label: 'Mark Reviewed' },
  { value: 'shortlisted', label: 'Shortlist' },
  { value: 'rejected', label: 'Reject' },
  { value: 'export', label: 'Export' },
  { value: 'delete', label: 'Delete Selected' },
];

export const statusActionLabels = {
  reviewed: 'Mark as Reviewed',
  shortlisted: 'Shortlist',
  rejected: 'Reject',
  hired: 'Hire',
  new: 'Reset to New',
};
