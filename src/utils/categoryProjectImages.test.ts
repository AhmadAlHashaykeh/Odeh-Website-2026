import { describe, expect, it } from 'vitest';
import { resolveMediaUrl } from './mediaUrl';
import {
  collectCategoryProjectImages,
  resolveCategoryDisplayImages,
  resolveCategoryFallbackImage,
  CATEGORY_IMAGE_ROTATION_MS,
} from './categoryProjectImages';

describe('categoryProjectImages', () => {
  const projects = [
    {
      id: '1',
      title: 'A',
      categorySlug: 'commercial',
      projectCategoryId: 'cat-1',
      published: true,
      status: 'published',
      displayOrder: 2,
      coverImage: '/storage/a.jpg',
      gallery: [{ src: '/storage/a-gallery.jpg' }],
    },
    {
      id: '2',
      title: 'B',
      categorySlug: 'commercial',
      projectCategoryId: 'cat-1',
      published: true,
      status: 'published',
      displayOrder: 1,
      coverImage: null,
      gallery: [{ src: '/storage/b-gallery.jpg' }],
    },
    {
      id: '3',
      title: 'Draft',
      categorySlug: 'commercial',
      projectCategoryId: 'cat-1',
      published: false,
      status: 'draft',
      displayOrder: 0,
      coverImage: '/storage/draft.jpg',
    },
    {
      id: '4',
      title: 'Other',
      categorySlug: 'residential',
      projectCategoryId: 'cat-2',
      published: true,
      status: 'published',
      displayOrder: 1,
      coverImage: '/storage/other.jpg',
    },
  ];

  it('collects published project images for one category in display order', () => {
    const urls = collectCategoryProjectImages(projects, {
      categorySlug: 'commercial',
      categoryId: 'cat-1',
    });

    expect(urls.map((url) => url.replace(/^.*\/storage\//, '/storage/'))).toEqual([
      '/storage/b-gallery.jpg',
      '/storage/a.jpg',
    ]);
  });

  it('excludes unpublished project images', () => {
    const urls = collectCategoryProjectImages(projects, { categorySlug: 'commercial' });
    expect(urls.some((url) => url.includes('draft.jpg'))).toBe(false);
  });

  it('falls back to stored category cover when no project images exist', () => {
    const images = resolveCategoryDisplayImages(
      { slug: 'empty', coverImage: '/storage/legacy.jpg' },
      [],
    );
    expect(resolveMediaUrl(images[0])).toContain('legacy.jpg');
    expect(resolveCategoryFallbackImage({ coverImage: '/storage/legacy.jpg' })).toContain(
      'legacy.jpg',
    );
  });

  it('exposes a stable rotation interval', () => {
    expect(CATEGORY_IMAGE_ROTATION_MS).toBeGreaterThan(1000);
  });
});
