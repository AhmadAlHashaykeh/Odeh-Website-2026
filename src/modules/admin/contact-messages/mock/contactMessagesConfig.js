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
  secondaryActions: [
    { label: 'Export Messages', icon: 'export' },
  ],
};

export const statusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

export const priorityFilterOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const inquiryTypeFilterOptions = [
  { value: 'all', label: 'All Inquiry Types' },
  { value: 'general-inquiry', label: 'General Inquiry' },
  { value: 'project-request', label: 'Project Request' },
  { value: 'career-inquiry', label: 'Career Inquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'media-press', label: 'Media / Press' },
  { value: 'other', label: 'Other' },
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
  { value: 'name_asc', label: 'Sender A–Z' },
  { value: 'name_desc', label: 'Sender Z–A' },
  { value: 'priority_desc', label: 'Highest Priority' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'status_asc', label: 'Status' },
];

export const bulkActionOptions = [
  { value: 'read', label: 'Mark Read' },
  { value: 'replied', label: 'Mark Replied' },
  { value: 'archived', label: 'Archive' },
  { value: 'assign', label: 'Assign' },
  { value: 'export', label: 'Export' },
  { value: 'delete', label: 'Delete Selected' },
];

export const adminAssigneeOptions = [
  { value: 'sarah-al-odeh', label: 'Sarah Al-Odeh' },
  { value: 'mohammad-nasser', label: 'Mohammad Nasser' },
  { value: 'hr-team', label: 'HR Team' },
  { value: 'partnerships-desk', label: 'Partnerships Desk' },
  { value: 'project-desk', label: 'Project Desk' },
];
