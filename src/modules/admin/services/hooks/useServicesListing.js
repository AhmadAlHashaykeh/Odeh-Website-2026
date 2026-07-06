import { useCallback, useMemo, useState } from 'react';
import * as servicesApi from '../../../../api/services';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = { ...COMMON_SORT_MAP };

export function useServicesListing({ initialPerPage = 12 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [homepageFilter, setHomepageFilter] = useState(ALL);
  const [seoFilter, setSeoFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');

  const queryState = useMemo(
    () => ({ statusFilter, homepageFilter, sortBy }),
    [statusFilter, homepageFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({ page, perPage, search, statusFilter: status, homepageFilter: homepage, sortBy: sort }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (homepage === 'yes') params.homepage = true;
      if (homepage === 'no') params.homepage = false;

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(servicesApi.list, [
        { id: 'total', label: 'Total Services', helper: 'Service offerings', params: {} },
        {
          id: 'published',
          label: 'Published',
          helper: 'Visible on website',
          params: { status: 'published' },
        },
        {
          id: 'homepage',
          label: 'On Homepage',
          helper: 'Home carousel',
          params: { homepage: true },
        },
        {
          id: 'hidden',
          label: 'Hidden',
          helper: 'Not publicly visible',
          params: { status: 'hidden' },
        },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn: servicesApi.list,
    destroyFn: servicesApi.destroy,
    showFn: servicesApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  return {
    ...listing,
    statusFilter,
    setStatusFilter,
    homepageFilter,
    setHomepageFilter,
    seoFilter,
    setSeoFilter,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    activeService: listing.activeItem,
    openService: listing.openItem,
    closeService: listing.closeItem,
  };
}
