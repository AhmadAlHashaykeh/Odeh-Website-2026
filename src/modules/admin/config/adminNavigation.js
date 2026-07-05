/**
 * Configuration-driven admin sidebar navigation.
 * Add new modules by extending the appropriate group below.
 */

export const adminDashboardItem = {
  id: 'dashboard',
  label: 'Dashboard',
  path: '/admin/dashboard',
  icon: 'dashboard',
  enabled: true,
};

export const adminNavigationGroups = [
  {
    id: 'content',
    title: 'Content',
    icon: 'gridView',
    defaultExpanded: true,
    items: [
      { id: 'projects', label: 'Projects', path: '/admin/projects', icon: 'projects', enabled: true },
      {
        id: 'project-categories',
        label: 'Project Categories',
        path: '/admin/project-categories',
        icon: 'categories',
        enabled: true,
      },
      { id: 'services', label: 'Services', path: '/admin/services', icon: 'services', enabled: true },
      { id: 'team-members', label: 'Team Members', path: '/admin/team-members', icon: 'team', enabled: true },
      { id: 'activities', label: 'Activities', path: '/admin/activities', icon: 'activities', enabled: true },
    ],
  },
  {
    id: 'recruitment',
    title: 'Recruitment',
    icon: 'careers',
    defaultExpanded: false,
    items: [
      { id: 'careers', label: 'Careers', path: '/admin/careers', icon: 'careers', enabled: true },
      {
        id: 'applications',
        label: 'Applications',
        path: '/admin/applications',
        icon: 'applications',
        enabled: true,
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'messages',
    defaultExpanded: false,
    items: [
      {
        id: 'contact-messages',
        label: 'Contact Messages',
        path: '/admin/contact-messages',
        icon: 'messages',
        enabled: true,
      },
    ],
  },
  {
    id: 'website',
    title: 'Website',
    icon: 'home',
    defaultExpanded: false,
    items: [
      { id: 'home-page', label: 'Home Page', path: '/admin/home-page', icon: 'home', enabled: true },
      { id: 'about-pages', label: 'About Pages', path: '/admin/about-pages', icon: 'about', enabled: true },
      {
        id: 'navigation-footer',
        label: 'Navigation & Footer',
        path: '/admin/navigation-footer',
        icon: 'navigation',
        enabled: true,
      },
      { id: 'connect-page', label: 'Connect Page', path: '/admin/connect-page', icon: 'connect', enabled: true },
      { id: 'legal-pages', label: 'Legal Pages', path: '/admin/legal-pages', icon: 'legal', enabled: true },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    defaultExpanded: false,
    items: [
      { id: 'seo', label: 'SEO', path: '/admin/seo', icon: 'seo', enabled: true },
      {
        id: 'website-settings',
        label: 'Website Settings',
        path: '/admin/website-settings',
        icon: 'settings',
        enabled: true,
      },
      { id: 'users-roles', label: 'Users & Roles', path: '/admin/users-roles', icon: 'users', enabled: true },
    ],
  },
];

export function getAllAdminNavItems() {
  return [adminDashboardItem, ...adminNavigationGroups.flatMap((group) => group.items)];
}

export function findNavGroupIdForPath(pathname) {
  const group = adminNavigationGroups.find((entry) =>
    entry.items.some((item) => isNavItemActive(item, pathname))
  );

  return group?.id ?? null;
}

export function isNavItemActive(item, pathname) {
  if (item.id === 'dashboard') {
    return pathname === item.path || pathname === `${item.path}/`;
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function getInitialExpandedGroups(pathname) {
  const activeGroupId = findNavGroupIdForPath(pathname);

  return adminNavigationGroups.reduce((state, group) => {
    state[group.id] = group.defaultExpanded || group.id === activeGroupId;
    return state;
  }, {});
}
