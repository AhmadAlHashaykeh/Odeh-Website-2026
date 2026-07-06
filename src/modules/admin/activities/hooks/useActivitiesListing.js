import { useCallback, useEffect, useMemo, useState } from 'react';
import * as activitiesApi from '../../../../api/activities';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  date_asc: 'activity_date',
  date_desc: '-activity_date',
  gallery_desc: '-display_order',
};

export function useActivitiesListing({ initialPerPage = 8 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [featuredFilter, setFeaturedFilter] = useState(ALL);
  const [yearFilter, setYearFilter] = useState(ALL);
  const [gallerySizeFilter, setGallerySizeFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [years, setYears] = useState([]);

  useEffect(() => {
    let cancelled = false;

    activitiesApi
      .list({ per_page: 50 })
      .then((response) => {
        if (cancelled) return;
        const derivedYears = [
          ...new Set(
            response.data
              .map((item) => item.activityYear || item.activityDate)
              .filter(Boolean)
              .map(String),
          ),
        ].sort((a, b) => Number(b) - Number(a));
        setYears(derivedYears);
      })
      .catch(() => {
        if (!cancelled) setYears([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const queryState = useMemo(
    () => ({ statusFilter, featuredFilter, sortBy }),
    [statusFilter, featuredFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({ page, perPage, search, statusFilter: status, featuredFilter: featured, sortBy: sort }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (featured === 'featured') params.featured = true;
      if (featured === 'not-featured') params.featured = false;

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(activitiesApi.list, [
        { id: 'total', label: 'Total Activities', helper: 'Community programs', params: {} },
        {
          id: 'published',
          label: 'Published',
          helper: 'Live on website',
          params: { status: 'published' },
        },
        {
          id: 'featured',
          label: 'Featured',
          helper: 'Highlighted entries',
          params: { featured: true },
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
    listFn: activitiesApi.list,
    destroyFn: activitiesApi.destroy,
    showFn: activitiesApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  return {
    ...listing,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    yearFilter,
    setYearFilter,
    gallerySizeFilter,
    setGallerySizeFilter,
    years,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    activeActivity: listing.activeItem,
    openActivity: listing.openItem,
    closeActivity: listing.closeItem,
  };
}
