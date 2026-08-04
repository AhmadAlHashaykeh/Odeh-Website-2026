import { resolveMediaUrl } from './mediaUrl';

/** Public/admin category cards rotate through project images on this interval. */
export const CATEGORY_IMAGE_ROTATION_MS = 3500;

function isPublishedProject(project) {
  if (project?.published === true) return true;
  if (project?.published === false) return false;
  return project?.status === 'published';
}

function matchesCategory(project, { categorySlug, categoryId } = {}) {
  if (categoryId && project?.projectCategoryId === categoryId) return true;
  if (categorySlug && project?.categorySlug === categorySlug) return true;
  return false;
}

function pushUniqueUrl(urls, seen, mediaRef) {
  const url = resolveMediaUrl(mediaRef);
  if (!url || seen.has(url)) return;
  seen.add(url);
  urls.push(url);
}

/**
 * Collect display images for a category card from its projects.
 * Prefer each project's cover image; fall back to its first gallery image.
 * Only published projects are included by default (public site requirement).
 *
 * @param {Array<object>} projects
 * @param {{ categorySlug?: string, categoryId?: string, publishedOnly?: boolean }} [options]
 * @returns {string[]}
 */
export function collectCategoryProjectImages(
  projects,
  { categorySlug, categoryId, publishedOnly = true } = {},
) {
  const matched = (projects ?? [])
    .filter((project) => {
      if (!matchesCategory(project, { categorySlug, categoryId })) return false;
      if (publishedOnly && !isPublishedProject(project)) return false;
      return true;
    })
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const urls = [];
  const seen = new Set();

  for (const project of matched) {
    if (project.coverImage) {
      pushUniqueUrl(urls, seen, project.coverImage);
      continue;
    }

    const gallery = project.gallery ?? [];
    if (gallery.length > 0) {
      pushUniqueUrl(urls, seen, gallery[0]?.src ?? gallery[0]);
    }
  }

  return urls;
}

/** Legacy stored category cover/featured image when no project images exist. */
export function resolveCategoryFallbackImage(category) {
  return (
    resolveMediaUrl(category?.coverImage) ||
    resolveMediaUrl(category?.featuredImage) ||
    ''
  );
}

export function resolveCategoryDisplayImages(category, projects, options = {}) {
  const projectImages = collectCategoryProjectImages(projects, {
    categorySlug: category?.slug,
    categoryId: category?.id,
    ...options,
  });

  if (projectImages.length > 0) {
    return projectImages;
  }

  const fallback = resolveCategoryFallbackImage(category);
  return fallback ? [fallback] : [];
}
