export const careersPageMeta = {
  title: 'Careers',
  description:
    'Manage job openings, hiring visibility, career page content, and application status.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Careers' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Careers' },
  ],
  primaryAction: { label: 'Add Job', icon: 'add' },
  secondaryActions: [
    { label: 'Export Jobs', icon: 'export' },
    { label: 'Career Page Preview', icon: 'external' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
];

export const employmentTypeFilterOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Internship', label: 'Internship' },
];

export const workModeFilterOptions = [
  { value: 'all', label: 'All Work Modes' },
  { value: 'On-site', label: 'On-site' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export const experienceFilterOptions = [
  { value: 'all', label: 'All Levels' },
  { value: 'Entry-level', label: 'Entry-level' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid-level', label: 'Mid-level' },
  { value: 'Senior', label: 'Senior' },
];

export const sortOptions = [
  { value: 'posted_desc', label: 'Recently Posted' },
  { value: 'posted_asc', label: 'Oldest Posted' },
  { value: 'closing_asc', label: 'Closing Soonest' },
  { value: 'closing_desc', label: 'Closing Latest' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'applications_desc', label: 'Most Applications' },
];

export const bulkActionOptions = [
  { value: 'open', label: 'Open Jobs' },
  { value: 'close', label: 'Close Jobs' },
  { value: 'draft', label: 'Mark as Draft' },
  { value: 'delete', label: 'Delete Selected' },
  { value: 'export', label: 'Export Selected' },
];
