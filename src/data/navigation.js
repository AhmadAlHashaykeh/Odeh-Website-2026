export const aboutDropdownLinks = [
  {
    label: 'Overview',
    path: '/about/overview',
    description: 'Company profile and vision',
    icon: 'overview',
  },
  {
    label: 'Approach',
    path: '/about/approach',
    description: 'How we deliver excellence',
    icon: 'approach',
  },
  {
    label: 'History',
    path: '/about/history',
    description: 'Our journey since 2017',
    icon: 'history',
  },
  {
    label: 'Team Members',
    path: '/about/team-members',
    description: 'The people behind the work',
    icon: 'team',
  },
  {
    label: 'Activities',
    path: '/about/activities',
    description: 'Events and community',
    icon: 'activities',
  },
];

export const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'About us',
    path: '/about/overview',
    dropdown: aboutDropdownLinks,
  },
  { label: 'Selected Projects', path: '/projects' },
  { label: 'Careers', path: '/careers' },
  { label: 'Reach Out', path: '/reach-out' },
];

export const footerQuickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Overview', path: '/about/overview' },
  { label: 'Approach', path: '/about/approach' },
  { label: 'History', path: '/about/history' },
  { label: 'Team Members', path: '/about/team-members' },
  { label: 'Activities', path: '/about/activities' },
  { label: 'Selected Projects', path: '/projects' },
  { label: 'Careers', path: '/careers' },
  { label: 'Reach Out', path: '/reach-out' },
  { label: 'Search', path: '/search' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

export const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'instagram',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: 'linkedin',
  },
];

export const contactInfo = {
  officeName: 'ODEH & PARTNERS DESIGN',
  contacts: [
    { email: 'ODEH@ODEHDESIGN.COM', phone: '+962799200301' },
    { email: 'NAJJAR@ODEHDESIGN.COM', phone: '+962795728939' },
    { email: 'YAZAN@ODEHDESIGN.COM', phone: '+962785511401' },
  ],
  location: 'Amman, Jordan',
  workingHours: {
    days: 'Sunday – Thursday',
    hours: '8:00 AM – 5:00 PM',
  },
};
