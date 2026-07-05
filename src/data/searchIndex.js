import { aboutDropdownLinks } from './navigation';
import { services } from './services';
import { projectsContent, getProjectPath } from './projectsContent';
import { activitiesContent } from './activitiesContent';
import { jobs, getJobPath } from './careers';

/**
 * Unified search index. Replace or extend when CMS is connected.
 */
export function buildSearchIndex() {
  const items = [];

  items.push({
    id: 'home',
    type: 'about',
    typeLabel: 'Page',
    title: 'Home',
    subtitle: 'ODEH & PARTNERS DESIGN',
    path: '/',
    keywords: ['home', 'odeh', 'structural', 'engineering', 'design', 'middle east'],
  });

  projectsContent.projects.forEach((project) => {
    items.push({
      id: `project-${project.id}`,
      type: 'project',
      typeLabel: 'Project',
      title: project.title,
      subtitle: project.location || project.type,
      path: getProjectPath(project),
      keywords: [
        project.type,
        project.location,
        project.description,
        project.services,
        project.status,
        'project',
        'projects',
        'structural',
        'engineering',
        'portfolio',
      ],
    });
  });

  items.push({
    id: 'projects-list',
    type: 'project',
    typeLabel: 'Project',
    title: 'Selected Projects',
    subtitle: 'Explore our portfolio',
    path: '/projects',
    keywords: ['project', 'projects', 'portfolio', 'structural', 'engineering'],
  });

  projectsContent.categories.forEach((category) => {
    items.push({
      id: `category-${category.slug}`,
      type: 'project',
      typeLabel: 'Category',
      title: category.title,
      subtitle: 'Selected Projects',
      path: `/projects/${category.slug}`,
      keywords: [category.description, category.title, 'category', 'projects', 'portfolio'],
    });
  });

  services.forEach((service) => {
    items.push({
      id: `service-${service.id}`,
      type: 'service',
      typeLabel: 'Service',
      title: service.title,
      subtitle: 'Engineering Service',
      path: service.path,
      keywords: [
        service.description,
        'service',
        'services',
        'engineering',
        'structural',
        'structural design',
        'structural engineering',
        'design',
        'bim',
      ],
    });
  });

  aboutDropdownLinks.forEach((page) => {
    items.push({
      id: `about-${page.path}`,
      type: 'about',
      typeLabel: 'About',
      title: page.label,
      subtitle: 'About Us',
      path: page.path,
      keywords: [page.description, 'about', 'company', page.label],
    });
  });

  activitiesContent.activities.forEach((activity) => {
    items.push({
      id: `activity-${activity.slug}`,
      type: 'about',
      typeLabel: 'Activity',
      title: activity.title,
      subtitle: activity.date,
      path: `/about/activities/${activity.slug}`,
      keywords: [
        activity.title,
        activity.date,
        activity.location,
        ...(activity.description ?? []),
        'activity',
        'activities',
        'events',
        'team',
      ],
    });
  });

  items.push({
    id: 'careers',
    type: 'career',
    typeLabel: 'Career',
    title: 'Careers',
    subtitle: 'Join our engineering team',
    path: '/careers',
    keywords: [
      'career',
      'careers',
      'jobs',
      'hiring',
      'engineer',
      'structural',
      'bim',
      'employment',
    ],
  });

  jobs.forEach((job) => {
    items.push({
      id: `job-${job.slug}`,
      type: 'career',
      typeLabel: 'Job Opening',
      title: job.title,
      subtitle: `${job.department} · ${job.location}`,
      path: getJobPath(job),
      keywords: [
        job.title,
        job.department,
        job.location,
        job.type,
        job.experienceLevel,
        job.workMode,
        job.shortDescription,
        'career',
        'careers',
        'job',
        'hiring',
      ],
    });
  });

  items.push({
    id: 'reach-out',
    type: 'about',
    typeLabel: 'Contact',
    title: 'Reach Out',
    subtitle: 'Contact ODEH & PARTNERS DESIGN',
    path: '/reach-out',
    keywords: ['contact', 'reach out', 'email', 'phone', 'inquiry', 'quote'],
  });

  return items;
}

const SEARCH_INDEX = buildSearchIndex();

function normalize(value) {
  return value.toLowerCase().trim();
}

function itemHaystack(item) {
  return normalize(
    [item.title, item.subtitle, item.typeLabel, ...(item.keywords || [])].join(' '),
  );
}

export function getSearchBadgeType(item) {
  if (item.type === 'project') return 'Project';
  if (item.type === 'career') return 'Career';
  if (item.typeLabel === 'Activity') return 'Activity';
  return 'Page';
}

export function getSearchExcerpt(item) {
  if (item.subtitle) return item.subtitle;

  const keyword = item.keywords?.find((word) => word.length > 12);
  if (keyword) {
    return keyword.length > 120 ? `${keyword.slice(0, 117)}…` : keyword;
  }

  return '';
}

function filterSearchResults(query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return SEARCH_INDEX.filter((item) => itemHaystack(item).includes(normalizedQuery));
}

export function getSearchSuggestions(query, limit = 8) {
  return filterSearchResults(query).slice(0, limit);
}

export function getSearchResults(query, limit = 50) {
  return filterSearchResults(query).slice(0, limit);
}
