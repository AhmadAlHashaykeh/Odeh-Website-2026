import { buildNavigationItems, initialNavigationFooterData, navigationFooterLastUpdated } from './navigationFooterData';

export const navigationFooterMeta = {
  title: 'Navigation & Footer',
  description: 'Manage the global website navigation, footer structure, and shared contact information.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website', path: '/admin/home-page' },
    { label: 'Navigation & Footer' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Navigation & Footer' },
  ],
  secondaryActions: [
    { label: 'Preview Website', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export const navigationFooterSectionNav = [
  { id: 'main-navigation', label: 'Main Navigation', icon: 'navigation' },
  { id: 'footer', label: 'Footer', icon: 'home' },
  { id: 'contact', label: 'Contact Information', icon: 'connect' },
  { id: 'social', label: 'Social Links', icon: 'external' },
  { id: 'global-cta', label: 'Global CTA', icon: 'services' },
];

export const mainNavigationPanels = [
  {
    id: 'nav-logo',
    name: 'Site Logo',
    description: 'Primary logo displayed in the navbar and footer brand column.',
    previewType: 'nav-logo',
    anchor: '/',
    status: 'published',
    dataKey: 'logo',
    sectionKey: 'logo',
  },
  {
    id: 'nav-menu',
    name: 'Primary Navigation',
    description: 'Main navbar links including the About us dropdown structure.',
    previewType: 'nav-menu',
    anchor: '/',
    status: 'published',
    dataKey: 'navigationItems',
    sectionKey: 'navigation',
  },
];

export const footerPanels = [
  {
    id: 'footer-brand',
    name: 'Footer Brand',
    description: 'Footer logo and firm description shown in the brand column.',
    previewType: 'footer-brand',
    anchor: '/',
    status: 'published',
    dataKey: 'footerBrand',
    sectionKey: 'footerBrand',
  },
  {
    id: 'footer-nav-get-started',
    name: 'Get Started Column',
    description: 'Footer navigation group linking to primary site destinations.',
    previewType: 'footer-nav-group',
    anchor: '/',
    status: 'published',
    dataKey: 'getStarted',
    sectionKey: 'footerNav',
    groupTitle: 'Get Started',
  },
  {
    id: 'footer-nav-about',
    name: 'About Us Column',
    description: 'Footer navigation group linking to About page destinations.',
    previewType: 'footer-nav-group',
    anchor: '/about/overview',
    status: 'published',
    dataKey: 'aboutUs',
    sectionKey: 'footerNav',
    groupTitle: 'About Us',
  },
  {
    id: 'footer-reach-us',
    name: 'Reach Us Column',
    description: 'Footer contact column with email, phone, and location details.',
    previewType: 'footer-contact',
    anchor: '/',
    status: 'published',
    dataKey: 'contact',
    sectionKey: 'footerContact',
  },
  {
    id: 'footer-copyright',
    name: 'Copyright',
    description: 'Footer bottom bar copyright notice.',
    previewType: 'footer-copyright',
    anchor: '/',
    status: 'published',
    dataKey: 'copyright',
    sectionKey: 'copyright',
  },
];

export const contactPanels = [
  {
    id: 'contact-office',
    name: 'Office & Hours',
    description: 'Office name, location, and working hours used on the Reach Out page.',
    previewType: 'contact-office',
    anchor: '/reach-out',
    status: 'published',
    dataKey: 'office',
    sectionKey: 'contact',
  },
  {
    id: 'contact-direct',
    name: 'Direct Contacts',
    description: 'Email and phone pairs for each team contact channel.',
    previewType: 'contact-direct',
    anchor: '/reach-out',
    status: 'published',
    dataKey: 'contacts',
    sectionKey: 'contact',
  },
];

export function buildSocialPanels(links) {
  return links.map((link) => ({
    id: `social-${link.icon}`,
    name: link.label,
    description: `${link.label} profile link used in the footer and Reach Out page.`,
    previewType: 'social-link',
    anchor: '/reach-out',
    status: 'published',
    dataKey: link.icon,
    sectionKey: 'social',
    platform: link.icon,
  }));
}

export const panelEditTitles = {
  'nav-logo': 'Edit Site Logo',
  'nav-menu': 'Edit Navigation Item',
  'footer-brand': 'Edit Footer Brand',
  'footer-nav-get-started': 'Edit Footer Link',
  'footer-nav-about': 'Edit Footer Link',
  'footer-reach-us': 'Edit Footer Contact',
  'footer-copyright': 'Edit Copyright',
  'contact-office': 'Edit Office & Hours',
  'contact-direct': 'Edit Direct Contact',
  'social-facebook': 'Edit Facebook Link',
  'social-instagram': 'Edit Instagram Link',
  'social-linkedin': 'Edit LinkedIn Link',
};

export function getPanelsForSection(sectionId, data) {
  switch (sectionId) {
    case 'main-navigation':
      return mainNavigationPanels;
    case 'footer':
      return footerPanels;
    case 'contact':
      return contactPanels;
    case 'social':
      return buildSocialPanels(data.socialLinks);
    default:
      return [];
  }
}

export function getPanelData(cmsData, panel) {
  switch (panel.id) {
    case 'nav-logo':
      return cmsData.logo;
    case 'nav-menu':
      return cmsData.navigationItems;
    case 'footer-brand':
      return cmsData.footerBrand;
    case 'footer-nav-get-started':
      return cmsData.footerNavGroups.find((g) => g.title === 'Get Started');
    case 'footer-nav-about':
      return cmsData.footerNavGroups.find((g) => g.title === 'About Us');
    case 'footer-reach-us':
      return cmsData.contact;
    case 'footer-copyright':
      return cmsData.copyright;
    case 'contact-office':
      return {
        officeName: cmsData.contact.officeName,
        location: cmsData.contact.location,
        workingHours: cmsData.contact.workingHours,
      };
    case 'contact-direct':
      return cmsData.contact.contacts;
    default:
      if (panel.sectionKey === 'social') {
        return cmsData.socialLinks.find((link) => link.icon === panel.platform);
      }
      return null;
  }
}

export function getPanelSummary(panelId, data) {
  switch (panelId) {
    case 'nav-logo':
      return `${data.alt} — ${data.src}`;
    case 'nav-menu':
      return data
        .map((item) => {
          if (item.hasDropdown) {
            return `${item.label} (${item.dropdown.length} sub-links)`;
          }
          return item.label;
        })
        .join(' · ');
    case 'footer-brand':
      return `${data.logo.alt} — ${data.text.slice(0, 72)}…`;
    case 'footer-nav-get-started':
    case 'footer-nav-about':
      return `${data.title} — ${data.links.map((l) => l.label).join(', ')}`;
    case 'footer-reach-us':
      return `${data.contacts.length} contacts · ${data.location}`;
    case 'footer-copyright':
      return `© ${new Date().getFullYear()} ${data.companyName}`;
    case 'contact-office':
      return `${data.officeName} · ${data.location} · ${data.workingHours.days}`;
    case 'contact-direct':
      return data.map((c) => c.email).join(' · ');
    default:
      if (data?.label && data?.href) {
        return `${data.label} — ${data.href}`;
      }
      return '';
  }
}

export function computeNavigationFooterStatistics() {
  const navItems = buildNavigationItems();
  const topLevel = navItems.length;
  const dropdownItems = navItems.reduce(
    (sum, item) => sum + (item.dropdown?.length ?? 0),
    0,
  );
  const footerSections = initialNavigationFooterData.footerNavGroups.length + 3;
  const socialCount = initialNavigationFooterData.socialLinks.length;
  const contactChannels =
    initialNavigationFooterData.contact.contacts.length + 2;

  return [
    {
      id: 'nav-items',
      value: String(topLevel + dropdownItems),
      label: 'Navigation Items',
      helper: `${topLevel} top-level · ${dropdownItems} dropdown`,
    },
    {
      id: 'footer-sections',
      value: String(footerSections),
      label: 'Footer Sections',
      helper: 'Brand · nav · contact · copyright',
    },
    { id: 'social', value: String(socialCount), label: 'Social Links' },
    {
      id: 'contact',
      value: String(contactChannels),
      label: 'Contact Channels',
      helper: 'Contacts · location · hours',
    },
    { id: 'cta', value: 'None', label: 'Global CTA', helper: 'Not used on site' },
    { id: 'seo', value: 'Ready', label: 'SEO Ready', helper: 'Global structure set' },
    { id: 'updated', value: navigationFooterLastUpdated, label: 'Last Updated' },
  ];
}

export function getInitialPanelData(panelId) {
  const data = structuredClone(initialNavigationFooterData);

  switch (panelId) {
    case 'nav-logo':
      return data.logo;
    case 'nav-menu':
      return data.navigationItems;
    case 'footer-brand':
      return data.footerBrand;
    case 'footer-nav-get-started':
      return data.footerNavGroups.find((g) => g.title === 'Get Started');
    case 'footer-nav-about':
      return data.footerNavGroups.find((g) => g.title === 'About Us');
    case 'footer-reach-us':
      return data.contact;
    case 'footer-copyright':
      return data.copyright;
    case 'contact-office':
      return {
        officeName: data.contact.officeName,
        location: data.contact.location,
        workingHours: data.contact.workingHours,
      };
    case 'contact-direct':
      return data.contact.contacts;
    default: {
      const social = data.socialLinks.find((link) => panelId === `social-${link.icon}`);
      return social ?? null;
    }
  }
}
