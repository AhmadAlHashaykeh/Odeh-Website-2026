export const legalPagesMeta = {
  title: 'Legal Pages',
  description: 'Manage legal documents and website compliance pages.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website', path: '/admin/home-page' },
    { label: 'Legal Pages' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Legal Pages' },
  ],
  secondaryActions: [
    { label: 'Preview', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export function computeLegalPagesStatistics(pages = []) {
  const published = pages.filter((page) => page.publicationStatus === 'published').length;
  const draft = pages.filter((page) => page.publicationStatus === 'draft').length;
  const internalLinks = pages.reduce(
    (sum, page) => sum + (page.internalLinks?.length ?? 0),
    0,
  );
  const seoComplete = pages.filter((page) => page.seoStatus === 'complete').length;
  const lastUpdated = pages[0]?.lastUpdated ?? '—';

  return [
    { id: 'total', value: String(pages.length), label: 'Total Legal Pages' },
    { id: 'published', value: String(published), label: 'Published' },
    { id: 'draft', value: String(draft), label: 'Draft' },
    { id: 'updated', value: lastUpdated ? String(lastUpdated).split('T')[0] : '—', label: 'Last Updated' },
    { id: 'internal-links', value: String(internalLinks), label: 'Internal Links' },
    {
      id: 'seo',
      value: pages.length === 0 || seoComplete === pages.length ? 'Complete' : 'Partial',
      label: 'SEO Status',
      helper: pages.length ? `${seoComplete}/${pages.length} pages ready` : 'No pages loaded',
    },
  ];
}

export function getSectionBody(page, sectionId) {
  const paragraphs = page.body[sectionId] ?? [];
  const listKey = `${sectionId}-list`;
  const listItems = page.body[listKey] ?? null;

  return { paragraphs, listItems };
}
