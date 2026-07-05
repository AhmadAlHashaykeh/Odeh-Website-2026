import { computeSeoScore, runSeoAudit } from '../utils/seoAudit';
import { initialSeoPages } from './buildSeoPages';

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
  secondaryActions: [{ label: 'SEO Audit', icon: 'search' }],
  primaryAction: { label: 'Save Draft', icon: 'check' },
};

export function enrichSeoPage(page) {
  const audit = runSeoAudit(page);
  const seoScore = computeSeoScore(audit);

  return {
    ...page,
    audit,
    seoScore,
    indexStatus: page.robotsIndex == null ? 'Default' : page.robotsIndex ? 'Index' : 'No Index',
    hasWarnings: audit.some((check) => check.status === 'fail' || check.status === 'warn'),
  };
}

export function enrichSeoPages(pages) {
  return pages.map(enrichSeoPage);
}

export function computeSeoStatistics(pages = initialSeoPages, { scope = 'website' } = {}) {
  const enriched = enrichSeoPages(pages);
  const completeMetadata = enriched.filter(
    (page) => page.metaTitle?.trim() && page.metaDescription?.trim(),
  ).length;
  const missingSeoData = enriched.filter(
    (page) => !page.metaTitle?.trim() || !page.metaDescription?.trim(),
  ).length;
  const needsAttention = enriched.filter((page) => page.hasWarnings).length;
  const averageScore =
    enriched.length > 0
      ? Math.round(enriched.reduce((sum, page) => sum + page.seoScore, 0) / enriched.length)
      : 0;

  if (scope === 'module') {
    return [
      {
        id: 'seo-score',
        value: `${averageScore}%`,
        label: 'Metadata Quality',
        helper: `${enriched.length} pages in module`,
      },
      {
        id: 'missing-seo',
        value: String(missingSeoData),
        label: 'Missing Metadata',
        helper: 'Pages missing title or description',
      },
      { id: 'complete', value: String(completeMetadata), label: 'Complete Pages' },
      {
        id: 'needs-attention',
        value: String(needsAttention),
        label: 'Needs Attention',
        helper: 'Pages with audit warnings',
      },
    ];
  }

  return [
    {
      id: 'seo-score',
      value: `${averageScore}%`,
      label: 'Metadata Quality',
      helper: `${enriched.length} public pages`,
    },
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
      helper: 'Pages with audit warnings',
    },
  ];
}

export function getInitialSeoPage(pageId) {
  const page = initialSeoPages.find((entry) => entry.id === pageId);
  return page ? structuredClone(page) : null;
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
