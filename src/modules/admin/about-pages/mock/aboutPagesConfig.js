import { teamContent } from '../../../../data/teamContent';
import { activitiesContent } from '../../../../data/activitiesContent';
import { adminTeamMembers } from '../../team-members/mock/teamMembersData';
import { adminActivities } from '../../activities/mock/activitiesData';
import {
  initialOverviewData,
  initialApproachData,
  initialHistoryData,
  aboutPagesLastUpdated,
} from './aboutPagesData';

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
};

export function getPanelsForSection(sectionId) {
  switch (sectionId) {
    case 'overview':
      return overviewPanels;
    case 'approach':
      return approachPanels;
    case 'history':
      return historyPanels;
    default:
      return [];
  }
}

export function getPanelSummary(panelId, data) {
  switch (panelId) {
    case 'overview-hero':
      return `${data.label} — ${data.title}`;
    case 'overview-intro':
      return `${data.title} — ${data.description.slice(0, 80)}…`;
    case 'overview-gallery':
      return `${data.label} — ${data.images.length} office images`;
    case 'approach-hero':
      return `${data.label} — ${data.title}`;
    case 'approach-principles':
      return `${data.label} — ${data.items.length} principles`;
    case 'history-hero':
      return `${data.label} — ${data.title}`;
    case 'history-story':
      return `${data.label} — ${data.title}`;
    case 'history-counters':
      return data.items.map((item) => `${item.value} ${item.label}`).join(' · ');
    case 'history-growth':
      return `${data.title} — ${data.rows.length} years of data`;
    default:
      return '';
  }
}

export function getPanelData(pagesData, panel) {
  return pagesData[panel.sectionKey][panel.dataKey];
}

export function computeAboutPagesStatistics() {
  const officeImages = initialOverviewData.slider.images.length;
  const teamCount = teamContent.members.length;
  const activitiesCount = activitiesContent.activities.length;
  const historyCounters = initialHistoryData.counters.items.length;
  const growthRows = initialHistoryData.growthTable.rows.length;
  const visibleTeam = adminTeamMembers.filter((m) => m.status === 'active').length;
  const publishedActivities = adminActivities.filter((a) => a.published).length;

  return [
    { id: 'pages', value: '5', label: 'About Pages' },
    { id: 'team', value: String(teamCount), label: 'Team Members', helper: `${visibleTeam} visible` },
    { id: 'activities', value: String(activitiesCount), label: 'Activities', helper: `${publishedActivities} published` },
    { id: 'office', value: String(officeImages), label: 'Office Images' },
    {
      id: 'history',
      value: `${historyCounters} · ${growthRows}`,
      label: 'History Metrics',
      helper: 'Counters & growth rows',
    },
    { id: 'seo', value: 'Complete', label: 'SEO Status', helper: 'All pages have meta' },
    { id: 'updated', value: aboutPagesLastUpdated, label: 'Last Updated' },
  ];
}

export function getInitialPanelData(panelId) {
  const panel = [...overviewPanels, ...approachPanels, ...historyPanels].find((p) => p.id === panelId);
  if (!panel) return null;

  const sectionData = {
    overview: initialOverviewData,
    approach: initialApproachData,
    history: initialHistoryData,
  }[panel.sectionKey];

  return sectionData ? structuredClone(sectionData[panel.dataKey]) : null;
}

export function getTeamOverviewStats() {
  const total = teamContent.members.length;
  const visible = adminTeamMembers.filter((m) => m.status === 'active').length;
  const preview = adminTeamMembers.filter((m) => m.status === 'active').slice(0, 4);
  return { total, visible, preview };
}

export function getActivitiesOverviewStats() {
  const total = activitiesContent.activities.length;
  const published = adminActivities.filter((a) => a.published).length;
  const preview = adminActivities.slice(0, 3);
  return { total, published, preview };
}
