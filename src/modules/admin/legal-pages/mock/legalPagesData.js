import { privacyPolicyContent } from '../../../../data/privacyPolicyContent';
import { termsContent } from '../../../../data/termsContent';
import { footerQuickLinks } from '../../../../data/navigation';

function countWords(content) {
  const texts = [];

  Object.values(content.body).forEach((value) => {
    if (Array.isArray(value)) {
      texts.push(...value);
    }
  });

  return texts.join(' ').split(/\s+/).filter(Boolean).length;
}

function getContentPreview(content) {
  const firstKey = content.sections[0]?.id;
  const paragraphs = content.body[firstKey];
  if (Array.isArray(paragraphs) && paragraphs[0]) {
    return paragraphs[0];
  }
  return content.hero.description;
}

function buildLegalPageRecord({ id, slug, path, content, internalLinks }) {
  const wordCount = countWords(content);

  return {
    id,
    slug,
    path,
    title: content.hero.title,
    hero: structuredClone(content.hero),
    meta: structuredClone(content.meta),
    sections: structuredClone(content.sections),
    body: structuredClone(content.body),
    lastUpdated: content.lastUpdated,
    publicationStatus: 'published',
    seoStatus: 'complete',
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    contentPreview: getContentPreview(content),
    internalLinks: structuredClone(internalLinks),
  };
}

const privacyFooterLink = footerQuickLinks.find((link) => link.path === '/privacy-policy');
const termsFooterLink = footerQuickLinks.find((link) => link.path === '/terms-and-conditions');

export const initialLegalPagesData = [
  buildLegalPageRecord({
    id: 'privacy-policy',
    slug: 'privacy-policy',
    path: '/privacy-policy',
    content: privacyPolicyContent,
    internalLinks: [
      {
        label: privacyFooterLink?.label ?? 'Privacy Policy',
        path: '/privacy-policy',
        source: 'footerQuickLinks',
      },
      {
        label: 'Terms & Conditions — Privacy section',
        path: '/terms-and-conditions',
        source: 'termsContent.body.privacy',
      },
    ],
  }),
  buildLegalPageRecord({
    id: 'terms-and-conditions',
    slug: 'terms-and-conditions',
    path: '/terms-and-conditions',
    content: termsContent,
    internalLinks: [
      {
        label: termsFooterLink?.label ?? 'Terms & Conditions',
        path: '/terms-and-conditions',
        source: 'footerQuickLinks',
      },
      {
        label: 'Route alias',
        path: '/terms',
        source: 'App.jsx redirect',
      },
    ],
  }),
];
