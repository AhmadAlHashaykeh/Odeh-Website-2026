export const PERMISSION_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'project-categories', label: 'Project Categories' },
  { id: 'team-members', label: 'Team Members' },
  { id: 'activities', label: 'Activities' },
  { id: 'services', label: 'Services' },
  { id: 'jobs', label: 'Careers' },
  { id: 'applications', label: 'Applications' },
  { id: 'contact-messages', label: 'Contact Messages' },
  { id: 'home-page', label: 'Home Page' },
  { id: 'about-pages', label: 'About Pages' },
  { id: 'navigation-footer', label: 'Navigation & Footer' },
  { id: 'connect-page', label: 'Connect Page' },
  { id: 'legal-pages', label: 'Legal Pages' },
  { id: 'seo', label: 'SEO' },
  { id: 'website-settings', label: 'Website Settings' },
  { id: 'users-roles', label: 'Users & Roles' },
];

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'];

export const usersRolesMeta = {
  title: 'Users & Roles',
  description: 'Manage admin accounts, roles, permissions, and access levels across the CMS.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Settings', path: '/admin/seo' },
    { label: 'Users & Roles' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Users & Roles' },
  ],
  primaryAction: { label: 'Invite User', icon: 'add' },
  secondaryActions: [{ label: 'Save Draft', icon: 'check' }],
};

export const usersRolesSectionNav = [
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'roles', label: 'Roles', icon: 'team' },
  { id: 'permissions', label: 'Permissions Matrix', icon: 'settings' },
];

export const userStatusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' },
];

export const userRoleFilterOptions = [{ value: 'all', label: 'All Roles' }];

export const userSortOptions = [
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'recent_login', label: 'Recent Login' },
  { value: 'created_desc', label: 'Newest First' },
];

export const userBulkActionOptions = [
  { value: 'activate', label: 'Activate' },
  { value: 'suspend', label: 'Suspend' },
  { value: 'resend-invite', label: 'Resend Invite' },
  { value: 'export', label: 'Export' },
  { value: 'delete', label: 'Delete' },
];

export const roleOptions = [];

export const departmentOptions = [
  { value: 'Executive', label: 'Executive' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Finance', label: 'Finance' },
];

export const accessScopeOptions = [
  { value: 'Full CMS', label: 'Full CMS' },
  { value: 'Content Modules', label: 'Content Modules' },
  { value: 'HR & Recruitment', label: 'HR & Recruitment' },
  { value: 'Media & Assets', label: 'Media & Assets' },
  { value: 'SEO & Settings', label: 'SEO & Settings' },
  { value: 'Read Only', label: 'Read Only' },
];

export const accessLevelOptions = [
  { value: 'Full', label: 'Full' },
  { value: 'Elevated', label: 'Elevated' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Limited', label: 'Limited' },
];

export const USER_ACTION_FEEDBACK = {
  view: (name) => `Viewing ${name} (preview mode)`,
  edit: (name) => `Edit form opened for ${name} (preview mode)`,
  'resend-invite': (name) => `Invite resent to ${name} (preview mode)`,
  suspend: (name) => `${name} suspended (preview mode)`,
  activate: (name) => `${name} activated (preview mode)`,
  'reset-password': (name) => `Password reset email sent to ${name} (preview mode)`,
  delete: (name) => `${name} removed (preview mode)`,
};

export const ROLE_ACTION_FEEDBACK = {
  view: (name) => `Viewing role "${name}" (preview mode)`,
  edit: (name) => `Edit form opened for role "${name}" (preview mode)`,
  duplicate: (name) => `Role "${name}" duplicated (preview mode)`,
  disable: (name) => `Role "${name}" disabled (preview mode)`,
  delete: (name) => `Role "${name}" deleted (preview mode)`,
  create: () => 'Role created (preview mode)',
};

export const NEW_ROLE_TEMPLATE = {
  id: null,
  name: '',
  description: '',
  accessLevel: 'Standard',
  status: 'active',
  userCount: 0,
  permissionCount: 0,
};

export const BULK_FEEDBACK = {
  activate: (count) => `${count} user(s) activated (preview mode)`,
  suspend: (count) => `${count} user(s) suspended (preview mode)`,
  'resend-invite': (count) => `Invite resent to ${count} user(s) (preview mode)`,
  export: (count) => `${count} user(s) exported (preview mode)`,
  delete: (count) => `${count} user(s) deleted (preview mode)`,
};

export function computeUsersRolesStatistics(users = [], roles = []) {
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const invitedUsers = users.filter((u) => u.status === 'invited').length;

  return [
    {
      id: 'total-users',
      value: String(users.length),
      label: 'Admin Users',
      helper: `${activeUsers} active`,
    },
    {
      id: 'roles',
      value: String(roles.length),
      label: 'Roles Defined',
      helper: `${roles.filter((r) => r.status === 'active').length} active`,
    },
    {
      id: 'invited',
      value: String(invitedUsers),
      label: 'Pending Invites',
      helper: invitedUsers > 0 ? 'Awaiting acceptance' : 'None pending',
    },
    {
      id: 'suspended',
      value: String(users.filter((u) => u.status === 'suspended').length),
      label: 'Suspended',
      helper: 'Accounts not currently active',
    },
  ];
}

export function getUserPermissionsSummary(user, roles) {
  const role = roles.find((r) => r.id === user.roleId);
  if (!role) return { count: 0, modules: [] };

  const modules = Object.entries(role.permissions)
    .filter(([, perms]) => Object.values(perms).some((v) => v === 'granted' || v === 'partial'))
    .map(([modId]) => modId);

  return { count: role.permissionCount, modules, roleName: role.name };
}
