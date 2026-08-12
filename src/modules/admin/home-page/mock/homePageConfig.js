export const homePageMeta = {
  title: 'Home Page',
  description: 'Manage the structured content displayed on the public homepage.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website', path: '/admin/home-page' },
    { label: 'Home Page' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Home Page' },
  ],
  secondaryActions: [
    { label: 'Preview Homepage', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export const sectionDefinitions = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'Full-viewport intro with video background, company badge, headline, stats strip, and primary CTAs.',
    status: 'published',
    anchor: '/',
    previewType: 'hero',
  },
  {
    id: 'about',
    name: 'About Preview',
    description: 'Homepage about teaser — title, body, stats, image, and Read More link.',
    status: 'published',
    anchor: '/#about',
    previewType: 'about',
    manageRoute: '/admin/about-pages',
    manageLabel: 'Open About Pages',
  },
  {
    id: 'services',
    name: 'Services Preview',
    description: 'Carousel section showcasing primary engineering and consulting service cards.',
    status: 'published',
    anchor: '/#services',
    previewType: 'services',
    manageRoute: '/admin/services',
    manageLabel: 'Manage Services',
  },
  {
    id: 'projects',
    name: 'Selected Projects Preview',
    description: 'Editorial grid of 3 projects chosen at random from a curated homepage pool.',
    status: 'published',
    anchor: '/#projects',
    previewType: 'projects',
    manageRoute: '/admin/projects',
    manageLabel: 'Manage Projects',
  },
];

export const sectionEditTitles = {
  hero: 'Edit Hero Section',
  about: 'Edit About Preview',
  services: 'Edit Services Preview',
  projects: 'Edit Selected Projects',
};

export function computeHomePageStatistics(sections, lastUpdated = '—') {
  const poolCount = Array.isArray(sections.projects?.poolProjectIds)
    ? sections.projects.poolProjectIds.length
    : (sections.projects?.projects?.length ?? 0);
  const visualAssets =
    2 +
    1 +
    (sections.services?.services?.length ?? 0) +
    poolCount;

  return [
    { id: 'sections', value: '4', label: 'Homepage Sections' },
    {
      id: 'services',
      value: String(sections.services?.services?.length ?? 0),
      label: 'Services Displayed',
    },
    {
      id: 'projects',
      value: String(poolCount),
      label: 'Homepage Project Pool',
    },
    { id: 'visual', value: String(visualAssets), label: 'Visual Assets' },
    { id: 'updated', value: lastUpdated ? String(lastUpdated).split('T')[0] : '—', label: 'Last Updated' },
    { id: 'seo', value: 'Complete', label: 'SEO Status', helper: 'Managed in SEO module', link: '/admin/seo' },
  ];
}

export function getSectionSummary(sectionId, sectionData) {
  switch (sectionId) {
    case 'hero':
      return `${sectionData.headingMain} ${sectionData.headingAccent} — ${sectionData.stats.length} stats, 2 CTAs`;
    case 'about':
      return `${sectionData.sectionLabel} — ${sectionData.stats.length} stats, Read More → ${sectionData.readMorePath}`;
    case 'services':
      return `${sectionData.heading} — ${sectionData.services.length} service cards in carousel`;
    case 'projects': {
      const poolCount = Array.isArray(sectionData.poolProjectIds)
        ? sectionData.poolProjectIds.length
        : (sectionData.projects?.length ?? 0);
      return `${sectionData.heading} — ${poolCount} in homepage pool (shows 3 at random)`;
    }
    default:
      return '';
  }
}
