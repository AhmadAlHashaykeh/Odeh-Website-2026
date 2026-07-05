/**
 * Transforms public website project data into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import { projectsContent } from '../../../../data/projectsContent';

const FEATURED_SLUGS = new Set([
  'himmeh-resort',
  'leen-park',
  'fairmont-hotel',
  'wadi-mousa-mosque',
  'sedret-al-ula',
  'royal-academy-for-nature-conservation',
  'dana-village',
]);

const DRAFT_SLUGS = new Set(['project-885', 'al-bayed', 'private-villa-z', 'ev-charger']);
const ARCHIVED_SLUGS = new Set(['army-steel-hanger', 'telecommunication-towers']);

const categoryMap = Object.fromEntries(
  projectsContent.categories.map((cat) => [cat.slug, cat.title]),
);

function normalizeProjectType(type) {
  if (!type || type === '-' || /[&<>]/.test(type)) return 'Structural';
  return type;
}

function parseYear(statusText) {
  const match = statusText?.match(/\d{4}/);
  return match ? Number(match[0]) : 2023;
}

function countServices(services) {
  if (!services) return 0;
  return services.split(/[,&]/).filter(Boolean).length;
}

function deterministicDate(slug, offsetDays = 0) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const base = new Date('2024-01-15');
  base.setDate(base.getDate() + (hash % 540) + offsetDays);
  return base.toISOString();
}

function resolveCmsStatus(slug) {
  if (ARCHIVED_SLUGS.has(slug)) return 'archived';
  if (DRAFT_SLUGS.has(slug)) return 'draft';
  return 'published';
}

export function buildAdminProjects() {
  return projectsContent.projects.map((project, index) => {
    const slug = project.slug || project.id;
    const cmsStatus = resolveCmsStatus(slug);
    const featured = FEATURED_SLUGS.has(slug);
    const gallery = project.gallery ?? [];

    return {
      id: project.id,
      title: project.title,
      slug,
      category: categoryMap[project.categorySlug] || project.categorySlug,
      categorySlug: project.categorySlug,
      status: cmsStatus,
      featured,
      published: cmsStatus === 'published',
      location: project.location || '—',
      projectType: normalizeProjectType(project.type),
      area: project.area || '—',
      year: parseYear(project.status),
      coverImage: project.coverImage,
      gallery,
      galleryCount: gallery.length,
      servicesCount: countServices(project.services),
      services: project.services || '',
      description: project.description || '',
      completionStatus: project.status || '',
      lastUpdated: deterministicDate(slug, 30),
      createdAt: deterministicDate(slug, 0),
      displayOrder: index + 1,
      seoStatus: cmsStatus === 'draft' ? 'pending' : 'complete',
    };
  });
}

export const adminProjects = buildAdminProjects();

export const projectCategories = projectsContent.categories.map((cat) => ({
  id: cat.id,
  slug: cat.slug,
  title: cat.title,
  projectCount: cat.projectCount,
}));

export function getProjectById(id) {
  return adminProjects.find((project) => project.id === id) ?? null;
}
