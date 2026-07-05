import { connectContent } from '../../../../data/connectLinks';
import { initialConnectPageData, connectPageLastUpdated } from './connectPageData';

const CONTACT_ICONS = new Set(['phone', 'email', 'whatsapp', 'maps']);
const SOCIAL_ICONS = new Set(['linkedin', 'instagram', 'facebook']);

export const connectPageMeta = {
  title: 'Connect Page',
  description:
    'Manage the standalone link hub used for social profiles and quick website access.',
  breadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Website', path: '/admin/home-page' },
    { label: 'Connect Page' },
  ],
  topBarBreadcrumbs: [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Connect Page' },
  ],
  secondaryActions: [
    { label: 'Preview Connect Page', icon: 'external' },
    { label: 'Save Draft', icon: 'check' },
  ],
};

export const connectPanelDefinitions = [
  {
    id: 'header-brand',
    name: 'Page Header / Brand',
    description: 'Logo and company name from Navigation & Footer. Edit the Connect page tagline here.',
    editType: 'header',
    linkIds: [],
    partialDelegation: true,
  },
  {
    id: 'quick-links',
    name: 'Quick Links',
    description: 'Internal website destinations surfaced on the Connect hub.',
    editType: 'link',
    linkIds: ['website', 'projects', 'careers', 'reach-out'],
  },
  {
    id: 'document-links',
    name: 'Document Links',
    description: 'Downloadable company resources linked from the Connect hub.',
    editType: 'link',
    linkIds: ['company-profile'],
  },
  {
    id: 'contact-links',
    name: 'Contact Links',
    description: 'Direct contact and location links — managed in Navigation & Footer.',
    editType: 'contact',
    linkIds: ['call', 'email', 'whatsapp', 'maps'],
    delegatedTo: '/admin/navigation-footer',
    manageLabel: 'Manage Navigation & Footer',
    manageIcon: 'navigation',
  },
  {
    id: 'social-links',
    name: 'Social Links',
    description: 'Social media profiles — managed in Navigation & Footer.',
    editType: 'social',
    linkIds: ['linkedin', 'instagram', 'facebook'],
    delegatedTo: '/admin/navigation-footer',
    manageLabel: 'Manage Navigation & Footer',
    manageIcon: 'navigation',
  },
];

export function getConnectLinkType(link) {
  if (link.icon === 'document') return 'document';
  if (CONTACT_ICONS.has(link.icon)) return 'contact';
  if (SOCIAL_ICONS.has(link.icon)) return 'social';
  if (link.external) return 'external';
  return 'internal';
}

export function getLinkTypeLabel(type) {
  switch (type) {
    case 'document':
      return 'Document';
    case 'contact':
      return 'Contact';
    case 'social':
      return 'Social';
    case 'external':
      return 'External';
    default:
      return 'Internal';
  }
}

export function getLinksForPanel(panelId, links = initialConnectPageData.links) {
  const panel = connectPanelDefinitions.find((entry) => entry.id === panelId);
  if (!panel) return [];

  if (panelId === 'header-brand') return [];

  return panel.linkIds
    .map((id) => links.find((link) => link.id === id))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function getEnabledLinks(links = initialConnectPageData.links) {
  return links.filter((link) => link.enabled).sort((a, b) => a.order - b.order);
}

export function computeConnectPageStatistics(links = connectContent.links) {
  const total = links.length;
  const enabled = links.filter((link) => link.enabled).length;
  const internal = links.filter((link) => getConnectLinkType(link) === 'internal').length;
  const external = links.filter((link) => link.external).length;
  const contact = links.filter((link) => getConnectLinkType(link) === 'contact').length;
  const social = links.filter((link) => getConnectLinkType(link) === 'social').length;

  return [
    { id: 'total', value: String(total), label: 'Total Links' },
    { id: 'enabled', value: String(enabled), label: 'Enabled Links' },
    { id: 'external', value: String(external), label: 'External Links' },
    { id: 'internal', value: String(internal), label: 'Internal Links' },
    { id: 'contact', value: String(contact), label: 'Contact Channels' },
    { id: 'social', value: String(social), label: 'Social Links' },
    { id: 'updated', value: connectPageLastUpdated, label: 'Last Updated' },
  ];
}

export function getEditModalTitle(editType) {
  switch (editType) {
    case 'header':
      return 'Edit Connect Tagline';
    case 'social':
      return 'Edit Social Link';
    case 'contact':
      return 'Edit Contact Link';
    default:
      return 'Edit Connect Link';
  }
}

export function getInitialLinkData(linkId) {
  return structuredClone(connectContent.links.find((link) => link.id === linkId) ?? null);
}

export function getInitialHeaderData() {
  return structuredClone({
    meta: connectContent.meta,
    hero: connectContent.hero,
  });
}
