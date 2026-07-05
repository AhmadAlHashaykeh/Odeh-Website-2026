/**
 * Transforms public website job listings into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import { jobs } from '../../../../data/careers';

const SEO_PENDING_SLUGS = new Set(['quantity-estimation-engineer', 'internship-structural-engineering']);

const APPLICATIONS_COUNT = {
  'structural-design-engineer': 14,
  'senior-structural-engineer': 8,
  'bim-modeler': 6,
  'site-supervision-engineer': 9,
  'quantity-estimation-engineer': 4,
  'internship-structural-engineering': 22,
};

function deterministicDate(slug, offsetDays = 0) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const base = new Date('2025-11-01');
  base.setDate(base.getDate() + (hash % 180) + offsetDays);
  return base.toISOString();
}

function buildWebsiteUsage(job, status) {
  const usage = ['Careers — Job Listings Page'];

  if (status === 'open') {
    usage.push(`Careers — ${job.title} Detail Page`);
    usage.push('Search Index — Career Results');
    usage.push('Navigation — Careers Menu');
  }

  if (job.department === 'Structural Engineering') {
    usage.push('About — Team Growth Section');
  }

  return usage;
}

function buildAdminJobs() {
  return jobs.map((job) => {
    const status = job.status;

    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      department: job.department,
      location: job.location,
      employmentType: job.type,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      postedDate: job.postedDate,
      closingDate: job.closingDate,
      shortDescription: job.shortDescription,
      fullDescription: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      preferredQualifications: job.preferredQualifications || [],
      responsibilitiesCount: job.responsibilities.length,
      requirementsCount: job.requirements.length,
      benefitsCount: job.benefits.length,
      status,
      applicationsCount: APPLICATIONS_COUNT[job.slug] ?? 0,
      seoStatus: SEO_PENDING_SLUGS.has(job.slug) ? 'pending' : 'complete',
      metaTitle: `${job.title} | Careers | ODEH & PARTNERS DESIGN`,
      metaDescription: job.shortDescription,
      lastUpdated: deterministicDate(job.slug),
      createdAt: deterministicDate(job.slug, -120),
      websiteUsage: buildWebsiteUsage(job, status),
    };
  });
}

export const adminJobs = buildAdminJobs();

export function getJobById(id) {
  return adminJobs.find((job) => job.id === id) ?? null;
}

export function isClosingSoon(closingDate, withinDays = 14) {
  if (!closingDate) return false;
  const closing = new Date(`${closingDate}T23:59:59`);
  const now = new Date();
  const diff = closing.getTime() - now.getTime();
  return diff >= 0 && diff <= withinDays * 24 * 60 * 60 * 1000;
}
