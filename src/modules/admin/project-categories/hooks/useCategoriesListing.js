import { useCallback, useEffect, useMemo, useState } from 'react';
import * as projectCategoriesApi from '../../../../api/projectCategories';
import * as projectsApi from '../../../../api/projects';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';
import {
  collectCategoryProjectImages,
  resolveCategoryDisplayImages,
} from '../../../../utils/categoryProjectImages';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  projects_asc: 'display_order',
  projects_desc: '-display_order',
};

function mapStatusFilter(statusFilter) {
  if (statusFilter === ALL) return undefined;
  if (statusFilter === 'hidden') return 'draft';
  return statusFilter;
}

function enrichCategory(category, projects) {
  const projectImages = resolveCategoryDisplayImages(category, projects, {
    publishedOnly: true,
  });
  const projectPreviews = projects
    .filter((project) => project.projectCategoryId === category.id)
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((project) => ({
      id: project.id,
      title: project.title,
      coverImage: project.coverImage,
      slug: project.slug,
      published: project.published,
    }));

  return {
    ...category,
    projectImages,
    projectPreviews,
    autoImageLabel:
      collectCategoryProjectImages(projects, {
        categoryId: category.id,
        categorySlug: category.slug,
        publishedOnly: true,
      }).length > 0
        ? 'Automatic from projects'
        : projectImages.length > 0
          ? 'Legacy category image'
          : 'No image yet',
  };
}

export function useCategoriesListing({ initialPerPage = 12 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [seoFilter, setSeoFilter] = useState(ALL);
  const [projectCountFilter, setProjectCountFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [projects, setProjects] = useState([]);

  const queryState = useMemo(
    () => ({ statusFilter, sortBy }),
    [statusFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({ page, perPage, search, statusFilter: status, sortBy: sort }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;

      const mappedStatus = mapStatusFilter(status);
      if (mappedStatus) params.status = mappedStatus;

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(projectCategoriesApi.list, [
        { id: 'total', label: 'Total Categories', helper: 'Portfolio groupings', params: {} },
        {
          id: 'published',
          label: 'Published',
          helper: 'Live on website',
          params: { status: 'published' },
        },
        {
          id: 'draft',
          label: 'Hidden',
          helper: 'Not visible publicly',
          params: { status: 'draft' },
        },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn: projectCategoriesApi.list,
    destroyFn: projectCategoriesApi.destroy,
    showFn: projectCategoriesApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  useEffect(() => {
    let cancelled = false;

    projectsApi
      .list({ per_page: 100, sort: 'display_order' })
      .then((response) => {
        if (!cancelled) {
          setProjects(response?.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [listing.isRefreshing]);

  const enrichedPaginatedItems = useMemo(
    () => (listing.paginatedItems ?? []).map((category) => enrichCategory(category, projects)),
    [listing.paginatedItems, projects],
  );

  const enrichedActiveCategory = useMemo(() => {
    if (!listing.activeItem) return null;
    return enrichCategory(listing.activeItem, projects);
  }, [listing.activeItem, projects]);

  return {
    ...listing,
    paginatedItems: enrichedPaginatedItems,
    filteredItems: enrichedPaginatedItems,
    activeCategory: enrichedActiveCategory,
    statusFilter,
    setStatusFilter,
    seoFilter,
    setSeoFilter,
    projectCountFilter,
    setProjectCountFilter,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    openCategory: listing.openItem,
    closeCategory: listing.closeItem,
  };
}
