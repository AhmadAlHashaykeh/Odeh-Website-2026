export const SEO_CONTENT_MODULES = [
  {
    id: 'website-pages',
    label: 'Website Pages',
    description: 'Home, About, Connect, and Legal pages',
    icon: 'home',
    groups: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'connect', label: 'Connect' },
      { id: 'legal', label: 'Legal' },
      { id: 'reach-out', label: 'Reach Out' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Project categories and individual project pages',
    icon: 'projects',
    groups: [
      { id: 'listing', label: 'Projects Overview' },
      { id: 'categories', label: 'Project Categories' },
      { id: 'projects', label: 'Individual Projects' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Individual service pages',
    icon: 'services',
    groups: [{ id: 'services', label: 'Services' }],
  },
  {
    id: 'activities',
    label: 'Activities',
    description: 'Activities listing and event pages',
    icon: 'activities',
    groups: [
      { id: 'listing', label: 'Activities Overview' },
      { id: 'activities', label: 'Activity Pages' },
    ],
  },
  {
    id: 'careers',
    label: 'Careers',
    description: 'Job listings and application pages',
    icon: 'careers',
    groups: [
      { id: 'listing', label: 'Careers Overview' },
      { id: 'jobs', label: 'Jobs' },
      { id: 'applications', label: 'Application Pages' },
    ],
  },
  {
    id: 'utility',
    label: 'Utility Pages',
    description: 'Search, thank-you, and other utility routes',
    icon: 'search',
    groups: [{ id: 'utility', label: 'Utility Pages' }],
  },
];

export function getSeoModuleById(moduleId) {
  return SEO_CONTENT_MODULES.find((module) => module.id === moduleId) ?? null;
}

export function getSeoModuleGroupLabel(moduleId, groupId) {
  const module = getSeoModuleById(moduleId);
  return module?.groups?.find((group) => group.id === groupId)?.label ?? groupId;
}

export function computeModuleSummaries(pages = []) {
  return SEO_CONTENT_MODULES.map((module) => ({
    ...module,
    pageCount: pages.filter((page) => page.contentModule === module.id).length,
  }));
}

export function groupPagesByModuleSection(moduleId, pages = []) {
  const module = getSeoModuleById(moduleId);
  if (!module?.groups?.length) {
    return [{ id: null, label: null, pages }];
  }

  return module.groups
    .map((group) => ({
      ...group,
      pages: pages.filter((page) => page.contentGroup === group.id),
    }))
    .filter((group) => group.pages.length > 0);
}
