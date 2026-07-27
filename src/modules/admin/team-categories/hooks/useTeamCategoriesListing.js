import { useCallback, useMemo, useState } from 'react';
import * as teamCategoriesApi from '../../../../api/teamCategories';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  name_asc: 'name',
  name_desc: '-name',
};

export function useTeamCategoriesListing({ initialPerPage = 50 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');

  const queryState = useMemo(() => ({ statusFilter, sortBy }), [statusFilter, sortBy]);

  const buildQueryParams = useCallback(({ page, perPage, search, statusFilter: status, sortBy: sort }) => {
    const params = {
      page,
      per_page: perPage,
      sort: mapSortKey(sort, SORT_MAP),
    };

    if (search) params.search = search;
    if (status !== ALL) params.status = status;

    return params;
  }, []);

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(teamCategoriesApi.list, [
        { key: 'total', label: 'Total', params: {} },
        { key: 'active', label: 'Active', params: { status: 'active' } },
        { key: 'inactive', label: 'Inactive', params: { status: 'inactive' } },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn: teamCategoriesApi.list,
    destroyFn: teamCategoriesApi.destroy,
    showFn: teamCategoriesApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  const reorderItems = useCallback(
    async (orderedIds) => {
      await teamCategoriesApi.reorder(orderedIds);
      await listing.refresh();
    },
    [listing],
  );

  return {
    ...listing,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    activeCategory: listing.activeItem,
    openCategory: listing.openItem,
    closeCategory: listing.closeItem,
    reorderItems,
    setViewMode: undefined,
    viewMode: 'table',
  };
}
