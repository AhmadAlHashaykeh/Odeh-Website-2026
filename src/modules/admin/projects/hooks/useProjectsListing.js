import { useCallback, useEffect, useMemo, useState } from 'react';
import * as projectsApi from '../../../../api/projects';
import * as projectCategoriesApi from '../../../../api/projectCategories';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
};

export function useProjectsListing({ initialPerPage = 10 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('updated_desc');
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const categoriesResponse = await projectCategoriesApi.list({ per_page: 50 });
        if (!cancelled) {
          setCategoryOptions(categoriesResponse.data);
        }
      } catch {
        if (!cancelled) {
          setCategoryOptions([]);
        }
      }
    }

    loadOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  const queryState = useMemo(
    () => ({
      statusFilter,
      categoryFilter,
      sortBy,
    }),
    [statusFilter, categoryFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({
      page,
      perPage,
      search,
      statusFilter: status,
      categoryFilter: category,
      sortBy: sort,
    }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (category !== ALL) params.category = category;

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(projectsApi.list, [
        { id: 'total', label: 'Total Projects', helper: 'Portfolio entries', params: {} },
        {
          id: 'published',
          label: 'Published',
          helper: 'Live on website',
          params: { status: 'published' },
        },
        {
          id: 'draft',
          label: 'Draft',
          helper: 'Awaiting review',
          params: { status: 'draft' },
        },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn: projectsApi.list,
    destroyFn: projectsApi.destroy,
    showFn: projectsApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  const categories = useMemo(
    () => categoryOptions.map((category) => category.title),
    [categoryOptions],
  );

  return {
    ...listing,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    categories,
    categoryRecords: categoryOptions,
    simulateRefresh: listing.refresh,
    activeProject: listing.activeItem,
    openProject: listing.openItem,
    closeProject: listing.closeItem,
  };
}
