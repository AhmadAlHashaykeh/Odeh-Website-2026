import { contactInfo } from '../../../../data/navigation';
import { MAP_EMBED_URL } from '../../../../data/reachOutContent';
import {
  initialSeoMeta,
  initialHeroSection,
} from '../../home-page/mock/homePageData';
import { siteLogo } from '../../navigation-footer/mock/navigationFooterData';

/**
 * Mock global website settings derived from existing public sources:
 * index.html, navigation.js, reachOutContent.js, search components, homePageData.js
 */
export const initialWebsiteSettings = {
  general: {
    websiteName: initialSeoMeta.title,
    websiteDescription: initialSeoMeta.description,
    defaultLanguage: 'en',
    copyrightCompanyName: 'ODEH & PARTNERS DESIGN',
  },
  branding: {
    logo: structuredClone(siteLogo),
    favicon: {
      src: '/odeh-logo2.png',
      type: 'image/png',
    },
    brandName: 'ODEH & PARTNERS DESIGN',
    primaryFont: 'Poppins',
    heroPoster: initialHeroSection.posterImage,
    heroVideo: initialHeroSection.videoSrc,
  },
  contact: structuredClone(contactInfo),
  search: {
    pagePlaceholder: 'Search projects, activities, careers, pages...',
    overlayPlaceholder: 'Search projects, services, careers...',
    overlaySubtitle: 'Search across projects, services and careers.',
    suggestionsLimit: 8,
    resultsLimit: 50,
    available: true,
  },
  integrations: {
    googleMapsEmbedUrl: MAP_EMBED_URL,
    googleMapsExternalUrl: 'https://maps.google.com/?q=Odeh+Design+Office+Amman+Jordan',
    analytics: null,
  },
};

export const websiteSettingsLastUpdated = 'Jul 5, 2026';
