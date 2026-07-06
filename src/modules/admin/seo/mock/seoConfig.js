export const seoManagementMeta = {
  title: 'SEO Management',
  description: 'Manage metadata, indexing, previews, and search visibility by content module.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Settings', path: '/admin/seo' },
    { label: 'SEO Management' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'SEO Management' },
  ],
  secondaryActions: [{ label: 'Refresh', icon: 'search' }],
  primaryAction: { label: 'Save Draft', icon: 'check' },
};

export function computeSeoStatistics(pages = [], { scope = 'website' } = {}) {
  const completeMetadata = pages.filter(
    (page) => page.metaTitle?.trim() && page.metaDescription?.trim(),
  ).length;
  const missingSeoData = pages.filter(
    (page) => !page.metaTitle?.trim() || !page.metaDescription?.trim(),
  ).length;
  const needsAttention = pages.filter(
    (page) => page.seoStatus && page.seoStatus !== 'complete',
  ).length;
  const completeByStatus = pages.filter((page) => page.seoStatus === 'complete').length;

  if (scope === 'module') {
    return [
      {
        id: 'complete',
        value: String(completeMetadata),
        label: 'Complete Metadata',
        helper: `${enrichedCountHelper(pages)} pages in module`,
      },
      {
        id: 'missing-seo',
        value: String(missingSeoData),
        label: 'Missing Metadata',
        helper: 'Pages missing title or description',
      },
      {
        id: 'needs-attention',
        value: String(needsAttention),
        label: 'Needs Attention',
        helper: 'Pages not marked complete',
      },
      {
        id: 'seo-status',
        value: `${completeByStatus}/${pages.length || 0}`,
        label: 'SEO Status',
        helper: 'Backend registry status',
      },
    ];
  }

  return [
    { id: 'complete', value: String(completeMetadata), label: 'Complete Metadata' },
    {
      id: 'missing-seo',
      value: String(missingSeoData),
      label: 'Missing Metadata',
      helper: 'Pages missing title or description',
    },
    {
      id: 'needs-attention',
      value: String(needsAttention),
      label: 'Needs Attention',
      helper: 'Pages not marked complete',
    },
    {
      id: 'seo-status',
      value: `${completeByStatus}/${pages.length || 0}`,
      label: 'SEO Status',
      helper: `${pages.length} public pages`,
    },
  ];
}

function enrichedCountHelper(pages) {
  return pages.length;
}

export const PAGE_TYPE_LABELS = {
  static: 'Static Page',
  about: 'About Page',
  listing: 'Listing Page',
  legal: 'Legal Page',
  utility: 'Utility Page',
  'activity-detail': 'Activity Detail',
  'project-category': 'Project Category',
  'project-detail': 'Project Detail',
  service: 'Service Page',
  'career-detail': 'Career Detail',
  'career-apply': 'Job Application',
  'career-apply-thank-you': 'Application Thank You',
};
