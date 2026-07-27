export const aboutPagesMeta = {
  title: 'About Pages',
  description: 'Manage the structured About content used across the public website.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website', path: '/admin/home-page' },
    { label: 'About Pages' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'About Pages' },
  ],
  secondaryActions: [
    { label: 'Preview About', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export const aboutSectionNav = [
  { id: 'overview', label: 'Overview', icon: 'about' },
  { id: 'approach', label: 'Approach', icon: 'services' },
  { id: 'history', label: 'History', icon: 'projects' },
  { id: 'team', label: 'Team Members', icon: 'team' },
  { id: 'activities', label: 'Activities', icon: 'activities' },
];

export const overviewPanels = [
  {
    id: 'overview-hero',
    name: 'Hero Content',
    description: 'Page header with label, title, description, and background image.',
    previewType: 'about-hero',
    anchor: '/about/overview',
    status: 'published',
    dataKey: 'hero',
    sectionKey: 'overview',
  },
  {
    id: 'overview-intro',
    name: 'Company Introduction',
    description: 'Firm overview with title, body copy, and featured office image.',
    previewType: 'company-intro',
    anchor: '/about/overview',
    status: 'published',
    dataKey: 'content',
    sectionKey: 'overview',
  },
  {
    id: 'overview-gallery',
    name: 'Office Gallery',
    description: 'Slider section showcasing workspace photography.',
    previewType: 'office-gallery',
    anchor: '/about/overview',
    status: 'published',
    dataKey: 'slider',
    sectionKey: 'overview',
  },
];

export const approachPanels = [
  {
    id: 'approach-hero',
    name: 'Hero Content',
    description: 'Page header with label, title, description, and background image.',
    previewType: 'about-hero',
    anchor: '/about/approach',
    status: 'published',
    dataKey: 'hero',
    sectionKey: 'approach',
  },
  {
    id: 'approach-principles',
    name: 'Engineering Principles',
    description: 'Ordered list of seven engineering principles with titles and descriptions.',
    previewType: 'principles',
    anchor: '/about/approach',
    status: 'published',
    dataKey: 'principles',
    sectionKey: 'approach',
  },
];

export const historyPanels = [
  {
    id: 'history-hero',
    name: 'Hero Content',
    description: 'Page header with label, title, description, and background image.',
    previewType: 'about-hero',
    anchor: '/about/history',
    status: 'published',
    dataKey: 'hero',
    sectionKey: 'history',
  },
  {
    id: 'history-story',
    name: 'Company Story',
    description: 'Narrative section with label, title, lead, and body text.',
    previewType: 'story',
    anchor: '/about/history',
    status: 'published',
    dataKey: 'story',
    sectionKey: 'history',
  },
  {
    id: 'history-counters',
    name: 'Statistics Counters',
    description: 'Key metrics displayed as animated counters on the History page.',
    previewType: 'counters',
    anchor: '/about/history',
    status: 'published',
    dataKey: 'counters',
    sectionKey: 'history',
  },
  {
    id: 'history-growth',
    name: 'Growth Data',
    description: 'Year-by-year table of completed projects and total area.',
    previewType: 'growth-table',
    anchor: '/about/history',
    status: 'published',
    dataKey: 'growthTable',
    sectionKey: 'history',
  },
];

export const teamPanels = [
  {
    id: 'team-hero',
    name: 'Hero Content',
    description: 'Page header with label, title, subtitle, description, and background image.',
    previewType: 'about-hero',
    anchor: '/about/team-members',
    status: 'published',
    dataKey: 'hero',
    sectionKey: 'team',
  },
  {
    id: 'team-meta',
    name: 'SEO / Meta',
    description: 'Page title and meta description for the Team Members page.',
    previewType: 'about-meta',
    anchor: '/about/team-members',
    status: 'published',
    dataKey: 'meta',
    sectionKey: 'team',
  },
];

export const activitiesPanels = [
  {
    id: 'activities-hero',
    name: 'Hero Content',
    description: 'Page header with label, title, description, and background image.',
    previewType: 'about-hero',
    anchor: '/about/activities',
    status: 'published',
    dataKey: 'hero',
    sectionKey: 'activities',
  },
  {
    id: 'activities-meta',
    name: 'SEO / Meta',
    description: 'Page title and meta description for the Activities page.',
    previewType: 'about-meta',
    anchor: '/about/activities',
    status: 'published',
    dataKey: 'meta',
    sectionKey: 'activities',
  },
];

export const panelEditTitles = {
  'overview-hero': 'Edit Overview Hero',
  'overview-intro': 'Edit Company Introduction',
  'overview-gallery': 'Edit Office Gallery',
  'approach-hero': 'Edit Approach Hero',
  'approach-principles': 'Edit Engineering Principles',
  'history-hero': 'Edit History Hero',
  'history-story': 'Edit History Story',
  'history-counters': 'Edit Statistics Counters',
  'history-growth': 'Edit Growth Data',
  'team-hero': 'Edit Team Hero',
  'team-meta': 'Edit Team SEO / Meta',
  'activities-hero': 'Edit Activities Hero',
  'activities-meta': 'Edit Activities SEO / Meta',
};

export function getPanelsForSection(sectionId) {
  switch (sectionId) {
    case 'overview':
      return overviewPanels;
    case 'approach':
      return approachPanels;
    case 'history':
      return historyPanels;
    case 'team':
      return teamPanels;
    case 'activities':
      return activitiesPanels;
    default:
      return [];
  }
}

export function getPanelSummary(panelId, data) {
  if (!data) return '';

  switch (panelId) {
    case 'overview-hero':
    case 'approach-hero':
    case 'history-hero':
    case 'team-hero':
    case 'activities-hero':
      return `${data.label} — ${data.title}`;
    case 'overview-intro':
      return `${data.title} — ${data.description.slice(0, 80)}…`;
    case 'overview-gallery':
      return `${data.label} — ${data.images.length} office images`;
    case 'approach-principles':
      return `${data.label} — ${data.items.length} principles`;
    case 'history-story':
      return `${data.label} — ${data.title}`;
    case 'history-counters':
      return data.items.map((item) => `${item.value} ${item.label}`).join(' · ');
    case 'history-growth':
      return `${data.title} — ${data.rows.length} years of data`;
    case 'team-meta':
    case 'activities-meta':
      return data.title ?? '';
    default:
      return '';
  }
}

export function getPanelData(pagesData, panel) {
  return pagesData[panel.sectionKey][panel.dataKey];
}

export function computeAboutPagesStatistics(lastUpdated = '—', teamCount = 0, activitiesCount = 0) {
  return [
    { id: 'pages', value: '3', label: 'About Sections' },
    { id: 'team', value: String(teamCount), label: 'Team Members' },
    { id: 'activities', value: String(activitiesCount), label: 'Activities' },
    { id: 'seo', value: 'Complete', label: 'SEO Status', helper: 'All pages have meta' },
    { id: 'updated', value: lastUpdated ? String(lastUpdated).split('T')[0] : '—', label: 'Last Updated' },
  ];
}

export function getTeamOverviewStats() {
  return { total: 0, visible: 0, preview: [] };
}

export function getActivitiesOverviewStats() {
  return { total: 0, published: 0, preview: [] };
}
