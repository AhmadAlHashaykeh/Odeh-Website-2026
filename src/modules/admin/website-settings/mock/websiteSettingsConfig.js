import { buildSearchIndex } from '../../../../data/searchIndex';
import { initialSeoPages } from '../../seo/mock/buildSeoPages';
import { initialWebsiteSettings } from './websiteSettingsData';

export const websiteSettingsMeta = {
  title: 'Website Settings',
  description: 'Manage global website configuration shared across the public website.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Settings', path: '/admin/seo' },
    { label: 'Website Settings' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website Settings' },
  ],
  secondaryActions: [
    { label: 'Preview Website', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export const websiteSettingsSectionNav = [
  { id: 'general', label: 'General', icon: 'settings' },
  { id: 'branding', label: 'Branding', icon: 'images' },
  { id: 'contact', label: 'Contact', icon: 'contact' },
  { id: 'localization', label: 'Localization', icon: 'about' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'integrations', label: 'Integrations', icon: 'connect' },
];

export const websiteSettingsShortcuts = [
  {
    id: 'navigation',
    title: 'Manage Navigation',
    description: 'Edit site navigation, footer structure, logo, social links, and copyright.',
    path: '/admin/navigation-footer',
    icon: 'navigation',
  },
  {
    id: 'seo',
    title: 'Manage SEO',
    description: 'Configure metadata, indexing, and search visibility for every public page.',
    path: '/admin/seo',
    icon: 'seo',
  },
  {
    id: 'legal',
    title: 'Manage Legal Pages',
    description: 'Update Privacy Policy and Terms & Conditions content.',
    path: '/admin/legal-pages',
    icon: 'legal',
  },
  {
    id: 'home',
    title: 'Manage Home Page',
    description: 'Edit homepage hero, section headers, and featured content selection.',
    path: '/admin/home-page',
    icon: 'home',
  },
  {
    id: 'about',
    title: 'Manage About Pages',
    description: 'Manage Overview, Approach, and History content across About pages.',
    path: '/admin/about-pages',
    icon: 'about',
  },
  {
    id: 'connect',
    title: 'Manage Connect Page',
    description: 'Configure Connect hub quick links, document links, and page tagline.',
    path: '/admin/connect-page',
    icon: 'connect',
  },
];

export function computeWebsiteSettingsStatistics(settings = initialWebsiteSettings) {
  const indexedPages = buildSearchIndex().length;
  const configuredIntegrations = [
    settings.integrations.googleMapsEmbedUrl,
    settings.integrations.googleMapsExternalUrl,
  ].filter(Boolean).length;

  return [
    { id: 'language', value: settings.general.defaultLanguage.toUpperCase(), label: 'Default Language' },
    { id: 'search-index', value: String(indexedPages), label: 'Indexed Search Items' },
    {
      id: 'integrations',
      value: configuredIntegrations > 0 ? `${configuredIntegrations} Active` : 'None',
      label: 'Map Integrations',
      helper: 'Google Maps on Reach Out & Connect',
    },
    {
      id: 'public-pages',
      value: String(initialSeoPages.length),
      label: 'Public Pages',
      helper: 'Routes with SEO metadata',
    },
  ];
}

export function getEditableSettingTitle(editKey) {
  const titles = {
    'general-identity': 'Site Identity',
    'branding-favicon': 'Favicon',
    'search-placeholders': 'Search Placeholders',
    'search-limits': 'Search Limits',
    'integrations-maps': 'Google Maps Embed',
  };

  return titles[editKey] ?? 'Edit Setting';
}

export function getInitialSettingsData() {
  return structuredClone(initialWebsiteSettings);
}
