/**
 * Transforms public website services into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import { services } from '../../../../data/services';

const HIDDEN_SLUGS = new Set(['university-engagements']);
const DRAFT_SLUGS = new Set(['retrofitting']);
const SEO_PENDING_SLUGS = new Set(['design-review', 'quantity-estimation', 'retrofitting']);
const NOT_ON_HOMEPAGE_SLUGS = new Set(['university-engagements', 'retrofitting']);

const FULL_DESCRIPTIONS = {
  'design-solutions':
    'Expert design services for concrete and steel elements, delivering optimized structural solutions tailored to project requirements. Our team combines advanced analysis with practical engineering to ensure buildability, efficiency, and compliance with international standards.',
  'site-supervision':
    'Comprehensive on-site supervision to oversee construction processes and ensure design integrity throughout execution. We coordinate with contractors, review workmanship, and resolve field issues to maintain quality and schedule alignment.',
  'bim-services':
    'Building Information Modeling with 3D modeling and 4D/5D visualizations to support planning, coordination, and project delivery. Our BIM workflows improve clash detection, quantity takeoffs, and stakeholder communication across complex builds.',
  'design-review':
    'Thorough technical design reviews that validate calculations, drawings, and specifications before construction. We identify risks early, recommend improvements, and help teams meet code requirements and client expectations.',
  'quantity-estimation':
    'Accurate quantity estimation services to support budgeting, procurement, and project planning. We provide detailed material breakdowns and cost-aware insights that help clients make informed decisions at every project stage.',
  'university-engagements':
    'Academic lectures and industry engagements at Jordanian universities, sharing structural engineering insights and real-world project experience with the next generation of engineers and designers.',
  retrofitting:
    'Specialized retrofitting and modernization of existing structures to extend service life, improve performance, and meet updated safety standards. We assess existing conditions and design practical upgrade solutions.',
};

function deterministicDate(slug, offsetDays = 0) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const base = new Date('2024-03-01');
  base.setDate(base.getDate() + (hash % 360) + offsetDays);
  return base.toISOString();
}

function resolveStatus(slug) {
  if (DRAFT_SLUGS.has(slug)) return 'draft';
  if (HIDDEN_SLUGS.has(slug)) return 'hidden';
  return 'published';
}

function buildWebsiteUsage(service, status, usedOnHomepage) {
  const usage = [];

  if (usedOnHomepage) usage.push('Homepage — Services Carousel');
  if (status === 'published') usage.push(`Services — ${service.title} Detail Page`);
  usage.push('Navigation — Services Menu');
  usage.push('Search Index — Service Results');

  if (service.slug === 'bim-services' || service.slug === 'design-solutions') {
    usage.push('About — Capabilities Overview');
  }

  return usage;
}

function buildAdminServices() {
  return services.map((service, index) => {
    const slug = service.id;
    const status = resolveStatus(slug);
    const published = status === 'published';
    const usedOnHomepage = published && !NOT_ON_HOMEPAGE_SLUGS.has(slug);
    const fullDescription = FULL_DESCRIPTIONS[slug] || service.description;

    return {
      id: slug,
      title: service.title,
      slug,
      description: service.description,
      descriptionPreview: service.description,
      fullDescription,
      image: service.image,
      icon: `/assets/services/icons/${slug}.svg`,
      status,
      published,
      usedOnHomepage,
      displayOrder: index + 1,
      seoStatus: SEO_PENDING_SLUGS.has(slug) ? 'pending' : 'complete',
      metaTitle: `${service.title} | ODEH & PARTNERS DESIGN`,
      metaDescription: service.description,
      lastUpdated: deterministicDate(slug),
      createdAt: deterministicDate(slug, -180),
      websiteUsage: buildWebsiteUsage(service, status, usedOnHomepage),
    };
  });
}

export const adminServices = buildAdminServices();

export function getServiceById(id) {
  return adminServices.find((service) => service.id === id) ?? null;
}
