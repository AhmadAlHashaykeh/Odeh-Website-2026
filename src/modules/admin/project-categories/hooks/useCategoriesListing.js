import { useCallback, useMemo, useState } from 'react';
import * as projectCategoriesApi from '../../../../api/projectCategories';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

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

export function useCategoriesListing({ initialPerPage = 12 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [seoFilter, setSeoFilter] = useState(ALL);
  const [projectCountFilter, setProjectCountFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');

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

  return {
    ...listing,
    statusFilter,
    setStatusFilter,
    seoFilter,
    setSeoFilter,
    projectCountFilter,
    setProjectCountFilter,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    activeCategory: listing.activeItem,
    openCategory: listing.openItem,
    closeCategory: listing.closeItem,
  };
}
