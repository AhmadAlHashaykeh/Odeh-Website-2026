/**
 * Transforms public website category data into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import { projectsContent, getProjectsByCategory } from '../../../../data/projectsContent';

/** CMS-only visibility — categories remain on the public site */
const HIDDEN_SLUGS = new Set(['restoration-conservation', 'steel-structures']);
const SEO_PENDING_SLUGS = new Set(['govermental', 'hospitals-and-medical-clinics']);

function deterministicDate(slug, offsetDays = 0) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const base = new Date('2024-06-01');
  base.setDate(base.getDate() + (hash % 400) + offsetDays);
  return base.toISOString();
}

export function buildAdminCategories() {
  return projectsContent.categories.map((category, index) => {
    const projects = getProjectsByCategory(category.slug);
    const featuredProject = projects.find((p) => p.coverImage) ?? projects[0];
    const published = !HIDDEN_SLUGS.has(category.slug);

    return {
      id: category.id,
      title: category.title,
      slug: category.slug,
      coverImage: category.coverImage,
      featuredImage: featuredProject?.coverImage ?? category.coverImage,
      description: category.description,
      projectCount: category.projectCount,
      displayOrder: index + 1,
      seoStatus: SEO_PENDING_SLUGS.has(category.slug) ? 'pending' : 'complete',
      publicationStatus: published ? 'published' : 'hidden',
      published,
      status: published ? 'published' : 'draft',
      lastUpdated: deterministicDate(category.slug, 0),
      createdAt: deterministicDate(category.slug, -200),
      projectPreviews: projects.slice(0, 6).map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        coverImage: project.coverImage,
      })),
      seoTitle: `${category.title} | ODEH & Partners Design`,
      seoDescription: category.description,
    };
  });
}

export const adminCategories = buildAdminCategories();

export function getCategoryById(id) {
  return adminCategories.find((category) => category.id === id) ?? null;
}
