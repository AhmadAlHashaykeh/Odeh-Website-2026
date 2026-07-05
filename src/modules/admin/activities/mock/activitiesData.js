/**
 * Transforms public website activity data into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import {
  activitiesContent,
  getRelatedActivities,
} from '../../../../data/activitiesContent';

const FEATURED_SLUGS = new Set(['site-visits', 'eftar-ramadan']);
const DRAFT_SLUGS = new Set(['trips']);

function parseYear(dateText) {
  const match = dateText?.match(/\d{4}/);
  return match ? Number(match[0]) : 2023;
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
  if (DRAFT_SLUGS.has(slug)) return 'draft';
  return 'published';
}

function getDescriptionPreview(description) {
  const text = Array.isArray(description) ? description.join(' ') : description || '';
  if (text.length <= 140) return text;
  return `${text.slice(0, 137)}...`;
}

function getFullDescription(description) {
  return Array.isArray(description) ? description.join('\n\n') : description || '';
}

export function buildAdminActivities() {
  return activitiesContent.activities.map((activity, index) => {
    const { slug } = activity;
    const cmsStatus = resolveCmsStatus(slug);
    const featured = FEATURED_SLUGS.has(slug);
    const gallery = activity.gallery ?? [];
    const fullDescription = getFullDescription(activity.description);

    return {
      id: activity.id,
      title: activity.title,
      slug,
      coverImage: activity.coverImage,
      gallery,
      galleryCount: gallery.length,
      activityDate: activity.date,
      activityYear: parseYear(activity.date),
      location: activity.location,
      descriptionPreview: getDescriptionPreview(activity.description),
      fullDescription,
      description: fullDescription,
      status: cmsStatus,
      publicationStatus: cmsStatus,
      published: cmsStatus === 'published',
      featured,
      seoStatus: cmsStatus === 'draft' ? 'pending' : 'complete',
      seoTitle: `${activity.title} | ODEH Activities`,
      seoDescription: getDescriptionPreview(activity.description),
      displayOrder: index + 1,
      createdAt: deterministicDate(slug, 0),
      lastUpdated: deterministicDate(slug, 30),
      publicationDate: cmsStatus === 'published' ? deterministicDate(slug, 15) : null,
      relatedActivities: getRelatedActivities(slug, 3).map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        coverImage: item.coverImage,
        date: item.date,
        location: item.location,
      })),
    };
  });
}

export const adminActivities = buildAdminActivities();

export function getActivityById(id) {
  return adminActivities.find((activity) => activity.id === id) ?? null;
}
