import { useCallback, useEffect, useMemo, useState } from 'react';
import * as teamApi from '../../../../api/team';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  name_asc: 'full_name',
  name_desc: '-full_name',
  experience_asc: 'display_order',
  experience_desc: '-display_order',
};

export function useTeamMembersListing({ initialPerPage = 12 } = {}) {
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [experienceFilter, setExperienceFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let cancelled = false;

    teamApi
      .list({ per_page: 50 })
      .then((response) => {
        if (cancelled) return;
        setDepartments(
          [...new Set(response.data.map((item) => item.department).filter(Boolean))].sort(),
        );
      })
      .catch(() => {
        if (!cancelled) setDepartments([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const queryState = useMemo(
    () => ({ departmentFilter, categoryFilter, statusFilter, sortBy }),
    [departmentFilter, categoryFilter, statusFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({
      page,
      perPage,
      search,
      departmentFilter: department,
      categoryFilter: category,
      statusFilter: status,
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
      if (department !== ALL) params.search = params.search
        ? `${params.search} ${department}`
        : department;

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(teamApi.list, [
        { id: 'total', label: 'Team Members', helper: 'Profiles on website', params: {} },
        {
          id: 'active',
          label: 'Active',
          helper: 'Visible profiles',
          params: { status: 'active' },
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
    listFn: teamApi.list,
    destroyFn: teamApi.destroy,
    showFn: teamApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  return {
    ...listing,
    departmentFilter,
    setDepartmentFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    sortBy,
    setSortBy,
    departments,
    simulateRefresh: listing.refresh,
    activeMember: listing.activeItem,
    openMember: listing.openItem,
    closeMember: listing.closeItem,
  };
}
