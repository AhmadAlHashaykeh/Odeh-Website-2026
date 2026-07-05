import {
  navLinks,
  footerQuickLinks,
  socialLinks,
  contactInfo,
} from '../../../../data/navigation';

/** Matches Footer.jsx brand copy exactly. */
export const footerBrandText =
  'ODEH & PARTNERS DESIGN is a leading Design firm that combines creativity and expertise to deliver innovative solutions that transcend traditional boundaries.';

/** Matches Navbar.jsx and Footer.jsx logo asset. */
export const siteLogo = {
  src: '/odeh-logo2.png',
  alt: 'ODEH & PARTNERS DESIGN',
};

/** Matches Footer.jsx NAV_GROUP_DEFS and buildNavGroups logic. */
const FOOTER_EXCLUDED_PATHS = new Set(['/privacy-policy', '/terms']);

const FOOTER_NAV_GROUP_DEFS = [
  {
    title: 'Get Started',
    paths: ['/', '/projects', '/careers', '/reach-out', '/search'],
  },
  {
    title: 'About Us',
    paths: [
      '/about/overview',
      '/about/approach',
      '/about/history',
      '/about/team-members',
      '/about/activities',
    ],
  },
];

function buildFooterNavGroups(links) {
  const linkMap = new Map(
    links.filter((link) => !FOOTER_EXCLUDED_PATHS.has(link.path)).map((link) => [link.path, link]),
  );

  return FOOTER_NAV_GROUP_DEFS.map((group) => ({
    title: group.title,
    links: group.paths.map((path) => linkMap.get(path)).filter(Boolean),
  }));
}

function slugFromPath(path) {
  return path.replace(/^\//, '').replace(/\//g, '-') || 'home';
}

export function buildNavigationItems() {
  return navLinks.map((link, index) => ({
    id: link.dropdown ? 'nav-about-us' : `nav-${slugFromPath(link.path)}`,
    label: link.label,
    path: link.path,
    order: index + 1,
    status: 'published',
    visible: true,
    hasDropdown: Boolean(link.dropdown),
    dropdown: link.dropdown
      ? link.dropdown.map((item, subIndex) => ({
          id: `dropdown-${slugFromPath(item.path)}`,
          label: item.label,
          path: item.path,
          description: item.description,
          icon: item.icon,
          order: subIndex + 1,
          status: 'published',
          visible: true,
        }))
      : null,
  }));
}

export const navigationFooterLastUpdated = 'Jul 5, 2026';

export const initialNavigationFooterData = {
  logo: structuredClone(siteLogo),
  navigationItems: buildNavigationItems(),
  footerBrand: {
    text: footerBrandText,
    logo: structuredClone(siteLogo),
  },
  footerNavGroups: buildFooterNavGroups(footerQuickLinks),
  footerQuickLinks: structuredClone(footerQuickLinks),
  copyright: {
    companyName: 'ODEH & PARTNERS DESIGN',
  },
  contact: structuredClone(contactInfo),
  socialLinks: structuredClone(socialLinks),
};
