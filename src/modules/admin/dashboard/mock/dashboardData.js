import { getWebsiteContentStats } from '../../utils/websiteContentStats';

const stats = getWebsiteContentStats();

export const websiteStats = stats;

export const kpiCards = [
  {
    id: 'projects',
    label: 'Total Projects',
    value: stats.projects,
    helper: 'Across all categories',
    icon: 'projects',
    accent: 'teal',
  },
  {
    id: 'categories',
    label: 'Categories',
    value: stats.categories,
    helper: 'Project groupings on /projects',
    icon: 'categories',
    accent: 'blue',
  },
  {
    id: 'team',
    label: 'Team Members',
    value: stats.teamMembers,
    helper: 'Profiles on About Team',
    icon: 'team',
    accent: 'purple',
  },
  {
    id: 'jobs',
    label: 'Open Jobs',
    value: stats.openPositions,
    helper: `${stats.careers} listings total`,
    icon: 'careers',
    accent: 'amber',
  },
  {
    id: 'activities',
    label: 'Activities',
    value: stats.activities,
    helper: 'About Activities entries',
    icon: 'activities',
    accent: 'rose',
  },
  {
    id: 'services',
    label: 'Services',
    value: stats.services,
    helper: 'Home page service cards',
    icon: 'services',
    accent: 'teal',
  },
];

export const contentOverviewCards = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio entries, galleries, and project metadata.',
    count: stats.projects,
    path: '/admin/projects',
    icon: 'projects',
  },
  {
    id: 'team',
    title: 'Team Members',
    description: 'Profiles, roles, and bios on the Team page.',
    count: stats.teamMembers,
    path: '/admin/team-members',
    icon: 'team',
  },
  {
    id: 'activities',
    title: 'Activities',
    description: 'Community programs shown on About Activities.',
    count: stats.activities,
    path: '/admin/activities',
    icon: 'activities',
  },
  {
    id: 'careers',
    title: 'Careers',
    description: 'Job listings and open positions on /careers.',
    count: stats.careers,
    path: '/admin/careers',
    icon: 'careers',
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Service cards and imagery on the Home page.',
    count: stats.services,
    path: '/admin/services',
    icon: 'services',
  },
  {
    id: 'home',
    title: 'Home Page',
    description: 'Hero, services section, and featured projects.',
    count: stats.services,
    path: '/admin/home-page',
    icon: 'home',
  },
];

export const quickActions = [
  { id: 'add-project', label: 'Add Project', icon: 'addProject', path: '/admin/projects' },
  { id: 'add-team', label: 'Add Team Member', icon: 'addTeam', path: '/admin/team-members' },
  { id: 'add-activity', label: 'Add Activity', icon: 'activities', path: '/admin/activities' },
  { id: 'create-job', label: 'Create Job', icon: 'createJob', path: '/admin/careers' },
  { id: 'edit-home', label: 'Edit Home Page', icon: 'home', path: '/admin/home-page' },
  {
    id: 'update-contact',
    label: 'Update Contact Information',
    icon: 'contact',
    path: '/admin/navigation-footer',
  },
];
