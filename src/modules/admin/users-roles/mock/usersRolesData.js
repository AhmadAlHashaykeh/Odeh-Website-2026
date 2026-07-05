export const PERMISSION_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects', label: 'Projects' },
  { id: 'project-categories', label: 'Project Categories' },
  { id: 'team-members', label: 'Team Members' },
  { id: 'activities', label: 'Activities' },
  { id: 'services', label: 'Services' },
  { id: 'careers', label: 'Careers' },
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

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'publish', 'manage'];

const FULL_ACCESS = Object.fromEntries(
  PERMISSION_MODULES.map((mod) => [
    mod.id,
    { view: 'granted', create: 'granted', edit: 'granted', delete: 'granted', publish: 'granted', manage: 'granted' },
  ]),
);

const VIEW_ONLY = Object.fromEntries(
  PERMISSION_MODULES.map((mod) => [
    mod.id,
    { view: 'granted', create: 'denied', edit: 'denied', delete: 'denied', publish: 'denied', manage: 'denied' },
  ]),
);

function contentManagerPermissions() {
  const perms = structuredClone(VIEW_ONLY);
  ['dashboard', 'projects', 'project-categories', 'activities', 'services', 'home-page', 'about-pages'].forEach(
    (id) => {
      perms[id] = { view: 'granted', create: 'granted', edit: 'granted', delete: 'denied', publish: 'granted', manage: 'denied' };
    },
  );
  return perms;
}

function hrManagerPermissions() {
  const perms = structuredClone(VIEW_ONLY);
  ['dashboard', 'team-members', 'careers', 'applications', 'contact-messages'].forEach((id) => {
    perms[id] = { view: 'granted', create: 'granted', edit: 'granted', delete: 'denied', publish: 'granted', manage: 'denied' };
  });
  return perms;
}

function mediaManagerPermissions() {
  const perms = structuredClone(VIEW_ONLY);
  ['dashboard', 'projects', 'project-categories', 'activities', 'services', 'team-members', 'home-page', 'navigation-footer', 'connect-page'].forEach((id) => {
    perms[id] = { view: 'granted', create: 'granted', edit: 'granted', delete: 'granted', publish: 'partial', manage: 'denied' };
  });
  return perms;
}

function seoManagerPermissions() {
  const perms = structuredClone(VIEW_ONLY);
  ['dashboard', 'seo', 'website-settings', 'home-page', 'about-pages', 'legal-pages', 'connect-page', 'navigation-footer'].forEach(
    (id) => {
      perms[id] = { view: 'granted', create: 'denied', edit: 'granted', delete: 'denied', publish: 'granted', manage: 'denied' };
    },
  );
  return perms;
}

export const initialRoles = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access across all CMS modules, settings, and user management.',
    accessLevel: 'Full',
    status: 'active',
    userCount: 2,
    permissionCount: 108,
    permissions: FULL_ACCESS,
  },
  {
    id: 'role-content-manager',
    name: 'Content Manager',
    description: 'Manage projects, services, activities, and public-facing content pages.',
    accessLevel: 'Elevated',
    status: 'active',
    userCount: 3,
    permissionCount: 42,
    permissions: contentManagerPermissions(),
  },
  {
    id: 'role-hr-manager',
    name: 'HR Manager',
    description: 'Oversee careers, applications, team members, and recruitment workflows.',
    accessLevel: 'Elevated',
    status: 'active',
    userCount: 2,
    permissionCount: 28,
    permissions: hrManagerPermissions(),
  },
  {
    id: 'role-media-manager',
    name: 'Media Manager',
    description: 'Manage images and galleries within projects, activities, services, and website pages.',
    accessLevel: 'Standard',
    status: 'active',
    userCount: 2,
    permissionCount: 24,
    permissions: mediaManagerPermissions(),
  },
  {
    id: 'role-seo-manager',
    name: 'SEO Manager',
    description: 'Configure metadata, indexing rules, and search visibility settings.',
    accessLevel: 'Standard',
    status: 'active',
    userCount: 1,
    permissionCount: 32,
    permissions: seoManagerPermissions(),
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to CMS modules for review and reporting purposes.',
    accessLevel: 'Limited',
    status: 'active',
    userCount: 1,
    permissionCount: 18,
    permissions: VIEW_ONLY,
  },
];

export const initialUsers = [
  {
    id: 'user-001',
    fullName: 'Ahmad Al-Odeh',
    email: 'ahmad.odeh@odeh.com',
    roleId: 'role-super-admin',
    role: 'Super Admin',
    status: 'active',
    initials: 'AO',
    avatar: null,
    department: 'Executive',
    lastLogin: '2026-07-05T14:22:00Z',
    createdDate: '2024-01-15T09:00:00Z',
    twoFactorEnabled: true,
    accessScope: 'Full CMS',
    loginActivity: [
      { date: '2026-07-05T14:22:00Z', ip: '185.XX.XX.42', device: 'Chrome · Windows' },
      { date: '2026-07-04T09:15:00Z', ip: '185.XX.XX.42', device: 'Chrome · Windows' },
      { date: '2026-07-03T16:48:00Z', ip: '185.XX.XX.42', device: 'Safari · iPhone' },
    ],
  },
  {
    id: 'user-002',
    fullName: 'Sara Khoury',
    email: 'sara.khoury@odeh.com',
    roleId: 'role-super-admin',
    role: 'Super Admin',
    status: 'active',
    initials: 'SK',
    avatar: null,
    department: 'Operations',
    lastLogin: '2026-07-05T11:05:00Z',
    createdDate: '2024-03-20T10:30:00Z',
    twoFactorEnabled: true,
    accessScope: 'Full CMS',
    loginActivity: [
      { date: '2026-07-05T11:05:00Z', ip: '92.XX.XX.18', device: 'Firefox · macOS' },
      { date: '2026-07-04T08:30:00Z', ip: '92.XX.XX.18', device: 'Firefox · macOS' },
    ],
  },
  {
    id: 'user-003',
    fullName: 'Omar Nassar',
    email: 'omar.nassar@odeh.com',
    roleId: 'role-content-manager',
    role: 'Content Manager',
    status: 'active',
    initials: 'ON',
    avatar: null,
    department: 'Marketing',
    lastLogin: '2026-07-04T17:30:00Z',
    createdDate: '2024-06-10T14:00:00Z',
    twoFactorEnabled: true,
    accessScope: 'Content Modules',
    loginActivity: [
      { date: '2026-07-04T17:30:00Z', ip: '79.XX.XX.55', device: 'Chrome · Windows' },
    ],
  },
  {
    id: 'user-004',
    fullName: 'Layla Hamdan',
    email: 'layla.hamdan@odeh.com',
    roleId: 'role-content-manager',
    role: 'Content Manager',
    status: 'active',
    initials: 'LH',
    avatar: null,
    department: 'Marketing',
    lastLogin: '2026-07-03T10:12:00Z',
    createdDate: '2024-08-05T11:00:00Z',
    twoFactorEnabled: false,
    accessScope: 'Content Modules',
    loginActivity: [
      { date: '2026-07-03T10:12:00Z', ip: '79.XX.XX.61', device: 'Edge · Windows' },
    ],
  },
  {
    id: 'user-005',
    fullName: 'Youssef Mansour',
    email: 'youssef.mansour@odeh.com',
    roleId: 'role-hr-manager',
    role: 'HR Manager',
    status: 'active',
    initials: 'YM',
    avatar: null,
    department: 'Human Resources',
    lastLogin: '2026-07-05T08:45:00Z',
    createdDate: '2024-09-12T09:30:00Z',
    twoFactorEnabled: true,
    accessScope: 'HR & Recruitment',
    loginActivity: [
      { date: '2026-07-05T08:45:00Z', ip: '185.XX.XX.90', device: 'Chrome · Windows' },
    ],
  },
  {
    id: 'user-006',
    fullName: 'Nadia Faris',
    email: 'nadia.faris@odeh.com',
    roleId: 'role-hr-manager',
    role: 'HR Manager',
    status: 'invited',
    initials: 'NF',
    avatar: null,
    department: 'Human Resources',
    lastLogin: null,
    createdDate: '2026-06-28T15:00:00Z',
    twoFactorEnabled: false,
    accessScope: 'HR & Recruitment',
    loginActivity: [],
  },
  {
    id: 'user-007',
    fullName: 'Karim Saleh',
    email: 'karim.saleh@odeh.com',
    roleId: 'role-media-manager',
    role: 'Media Manager',
    status: 'active',
    initials: 'KS',
    avatar: null,
    department: 'Creative',
    lastLogin: '2026-07-02T13:20:00Z',
    createdDate: '2025-01-08T10:00:00Z',
    twoFactorEnabled: true,
    accessScope: 'Content & Visual Assets',
    loginActivity: [
      { date: '2026-07-02T13:20:00Z', ip: '46.XX.XX.33', device: 'Chrome · macOS' },
    ],
  },
  {
    id: 'user-008',
    fullName: 'Rana Abboud',
    email: 'rana.abboud@odeh.com',
    roleId: 'role-media-manager',
    role: 'Media Manager',
    status: 'suspended',
    initials: 'RA',
    avatar: null,
    department: 'Creative',
    lastLogin: '2026-05-15T09:00:00Z',
    createdDate: '2025-02-14T11:30:00Z',
    twoFactorEnabled: false,
    accessScope: 'Content & Visual Assets',
    loginActivity: [
      { date: '2026-05-15T09:00:00Z', ip: '46.XX.XX.77', device: 'Safari · macOS' },
    ],
  },
  {
    id: 'user-009',
    fullName: 'Hana El-Sayed',
    email: 'hana.elsayed@odeh.com',
    roleId: 'role-seo-manager',
    role: 'SEO Manager',
    status: 'active',
    initials: 'HE',
    avatar: null,
    department: 'Digital',
    lastLogin: '2026-07-05T07:55:00Z',
    createdDate: '2025-04-01T08:00:00Z',
    twoFactorEnabled: true,
    accessScope: 'SEO & Settings',
    loginActivity: [
      { date: '2026-07-05T07:55:00Z', ip: '185.XX.XX.12', device: 'Chrome · Windows' },
    ],
  },
  {
    id: 'user-010',
    fullName: 'Tarek Ibrahim',
    email: 'tarek.ibrahim@odeh.com',
    roleId: 'role-content-manager',
    role: 'Content Manager',
    status: 'invited',
    initials: 'TI',
    avatar: null,
    department: 'Marketing',
    lastLogin: null,
    createdDate: '2026-07-01T12:00:00Z',
    twoFactorEnabled: false,
    accessScope: 'Content Modules',
    loginActivity: [],
  },
  {
    id: 'user-011',
    fullName: 'Maya Haddad',
    email: 'maya.haddad@odeh.com',
    roleId: 'role-viewer',
    role: 'Viewer',
    status: 'active',
    initials: 'MH',
    avatar: null,
    department: 'Finance',
    lastLogin: '2026-06-30T16:00:00Z',
    createdDate: '2025-06-15T09:00:00Z',
    twoFactorEnabled: false,
    accessScope: 'Read Only',
    loginActivity: [
      { date: '2026-06-30T16:00:00Z', ip: '92.XX.XX.44', device: 'Chrome · Windows' },
    ],
  },
];

export function getInitialUsersRolesData() {
  return {
    users: structuredClone(initialUsers),
    roles: structuredClone(initialRoles),
  };
}

export function getUserById(users, userId) {
  return users.find((user) => user.id === userId) ?? null;
}

export function getRoleById(roles, roleId) {
  return roles.find((role) => role.id === roleId) ?? null;
}
