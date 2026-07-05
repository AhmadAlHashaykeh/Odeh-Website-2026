import generated from './projectsContent.generated.json';

const CATEGORY_DESCRIPTION_OVERRIDES = {
  'resorts-and-hotels':
    'Luxury hospitality structures engineered for complex geometries, long spans, and demanding site conditions across the region.',
  govermental:
    'Government buildings and civic infrastructure engineered for durability, safety, and long-term public use.',
};

function normalizeProject(project) {
  if (project.slug && project.slug !== '') {
    return project;
  }

  const slug = 'project-885';
  return {
    ...project,
    id: slug,
    slug,
    coverImage: '/assets/projects/project-885/cover.webp',
    gallery: (project.gallery ?? []).map((image, index) => ({
      ...image,
      src: `/assets/projects/project-885/gallery-${String(index + 1).padStart(2, '0')}.webp`,
      alt: `${project.title} — image ${index + 1}`,
    })),
  };
}

const categories = generated.categories.map((category) => ({
  ...category,
  description:
    CATEGORY_DESCRIPTION_OVERRIDES[category.slug] ?? category.description,
}));

export const projectsContent = {
  meta: {
    title: 'Selected Projects | ODEH & PARTNERS DESIGN',
    description:
      'Discover a curated portfolio of structural engineering projects delivered across multiple sectors throughout the Middle East.',
  },
  hero: {
    label: 'PORTFOLIO',
    title: 'Selected Projects',
    description:
      'Discover a curated portfolio of structural engineering projects delivered across multiple sectors throughout the Middle East.',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Selected Projects' },
    ],
    ariaLabel: 'Selected Projects',
  },
  categories,
  projects: generated.projects.map(normalizeProject),
};

export function getAllCategories() {
  return projectsContent.categories;
}

export function getCategoryBySlug(slug) {
  return projectsContent.categories.find((category) => category.slug === slug) ?? null;
}

export function getProjectsByCategory(categorySlug) {
  return projectsContent.projects.filter((project) => project.categorySlug === categorySlug);
}

export function getProjectBySlug(categorySlug, projectSlug) {
  return (
    projectsContent.projects.find(
      (project) => project.categorySlug === categorySlug && project.slug === projectSlug,
    ) ?? null
  );
}

export function getRelatedProjects(categorySlug, currentSlug, limit = 3) {
  return projectsContent.projects
    .filter((project) => project.categorySlug === categorySlug && project.slug !== currentSlug)
    .slice(0, limit);
}

export function getCategoryTitle(categorySlug) {
  return getCategoryBySlug(categorySlug)?.title ?? categorySlug;
}

export function getProjectPath(project) {
  return `/projects/${project.categorySlug}/${project.slug}`;
}

export function getCategoryPath(category) {
  return `/projects/${category.slug}`;
}
