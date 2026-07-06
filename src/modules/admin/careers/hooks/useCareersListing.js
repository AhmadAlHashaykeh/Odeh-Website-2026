import { useCallback, useEffect, useMemo, useState } from 'react';
import * as jobsApi from '../../../../api/jobs';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  posted_asc: 'posted_date',
  posted_desc: '-posted_date',
  closing_asc: 'closing_date',
  closing_desc: '-closing_date',
  applications_desc: '-updated_at',
};

export function useCareersListing({ initialPerPage = 12 } = {}) {
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState(ALL);
  const [workModeFilter, setWorkModeFilter] = useState(ALL);
  const [experienceFilter, setExperienceFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('posted_desc');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let cancelled = false;

    jobsApi
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
    () => ({
      departmentFilter,
      statusFilter,
      employmentTypeFilter,
      workModeFilter,
      experienceFilter,
      sortBy,
    }),
    [
      departmentFilter,
      statusFilter,
      employmentTypeFilter,
      workModeFilter,
      experienceFilter,
      sortBy,
    ],
  );

  const buildQueryParams = useCallback(
    ({
      page,
      perPage,
      search,
      departmentFilter: department,
      statusFilter: status,
      employmentTypeFilter: employmentType,
      workModeFilter: workMode,
      experienceFilter: experienceLevel,
      sortBy: sort,
    }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (employmentType !== ALL) params.employment_type = employmentType;
      if (workMode !== ALL) params.work_mode = workMode;
      if (experienceLevel !== ALL) params.experience_level = experienceLevel;
      if (department !== ALL) {
        params.search = params.search ? `${params.search} ${department}` : department;
      }

      return params;
    },
    [],
  );

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(jobsApi.list, [
        { id: 'total', label: 'Total Jobs', helper: 'Career listings', params: {} },
        { id: 'open', label: 'Open', helper: 'Accepting applications', params: { status: 'open' } },
        {
          id: 'closed',
          label: 'Closed',
          helper: 'No longer accepting',
          params: { status: 'closed' },
        },
        { id: 'draft', label: 'Draft', helper: 'Unpublished listings', params: { status: 'draft' } },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn: jobsApi.list,
    destroyFn: jobsApi.destroy,
    showFn: jobsApi.show,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  return {
    ...listing,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    employmentTypeFilter,
    setEmploymentTypeFilter,
    workModeFilter,
    setWorkModeFilter,
    experienceFilter,
    setExperienceFilter,
    sortBy,
    setSortBy,
    departments,
    simulateRefresh: listing.refresh,
    activeJob: listing.activeItem,
    openJob: listing.openItem,
    closeJob: listing.closeItem,
  };
}
