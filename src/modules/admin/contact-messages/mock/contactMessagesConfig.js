export const contactMessagesPageMeta = {
  title: 'Contact Messages',
  description:
    'Review website inquiries, project requests, and contact form submissions.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Contact Messages' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Contact Messages' },
  ],
};

export const contactMessageStatusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const contactMessagePriorityLabels = {
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const priorityFilterOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const sortOptions = [
  { value: 'submitted_desc', label: 'Recently Submitted' },
  { value: 'submitted_asc', label: 'Oldest Submitted' },
  { value: 'name_asc', label: 'Sender A–Z' },
  { value: 'name_desc', label: 'Sender Z–A' },
  { value: 'priority_desc', label: 'Highest Priority' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'status_asc', label: 'Status' },
];
