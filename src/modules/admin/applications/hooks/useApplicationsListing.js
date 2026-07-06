import { useCallback, useEffect, useMemo, useState } from 'react';
import * as jobApplicationsApi from '../../../../api/jobApplications';
import * as jobsApi from '../../../../api/jobs';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  submitted_asc: 'created_at',
  submitted_desc: '-created_at',
  experience_desc: '-years_of_experience',
  experience_asc: 'years_of_experience',
  updated_desc: '-updated_at',
  status_asc: 'status',
};

function mapApplication(application) {
  return {
    ...application,
    applicantName: application.fullName,
    submittedDate: application.submittedAt?.split('T')[0] ?? application.submittedAt,
    cvFileName: application.cvOriginalName,
    coverLetterPreview: application.coverLetter,
    linkedInUrl: application.linkedinUrl,
  };
}

function getInitialViewMode() {
  if (typeof window === 'undefined') return 'table';
  return window.innerWidth <= 768 ? 'card' : 'table';
}

export function useApplicationsListing({ initialPerPage = 12, initialJobFilter = ALL } = {}) {
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [jobFilter, setJobFilter] = useState(initialJobFilter);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('submitted_desc');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (initialJobFilter !== ALL) {
      setJobFilter(initialJobFilter);
    }
  }, [initialJobFilter]);

  useEffect(() => {
    let cancelled = false;

    jobsApi
      .list({ per_page: 50 })
      .then((response) => {
        if (cancelled) return;
        setJobs(
          response.data.map((job) => ({ id: job.id, title: job.title })).sort((a, b) =>
            a.title.localeCompare(b.title),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const queryState = useMemo(
    () => ({
      jobFilter,
      statusFilter,
      sortBy,
    }),
    [jobFilter, statusFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({ page, perPage, search, jobFilter: job, statusFilter: status, sortBy: sort }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (job !== ALL) params.job = job;

      return params;
    },
    [],
  );

  const listFn = useCallback(async (params) => {
    const response = await jobApplicationsApi.list(params);
    return {
      ...response,
      data: response.data.map(mapApplication),
    };
  }, []);

  const showFn = useCallback(async (id) => {
    const response = await jobApplicationsApi.show(id);
    return { data: mapApplication(response.data) };
  }, []);

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(jobApplicationsApi.list, [
        { id: 'total', label: 'Total Applications', helper: 'All candidates', params: {} },
        { id: 'new', label: 'New', helper: 'Awaiting review', params: { status: 'new' } },
        {
          id: 'reviewed',
          label: 'Reviewed',
          helper: 'Initial screening done',
          params: { status: 'reviewed' },
        },
        {
          id: 'shortlisted',
          label: 'Shortlisted',
          helper: 'In interview pipeline',
          params: { status: 'shortlisted' },
        },
        { id: 'hired', label: 'Hired', helper: 'Offers accepted', params: { status: 'hired' } },
        {
          id: 'rejected',
          label: 'Rejected',
          helper: 'Not moving forward',
          params: { status: 'rejected' },
        },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn,
    showFn,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  const activeJobFilter = useMemo(() => {
    if (jobFilter === ALL) return null;
    return jobs.find((job) => String(job.id) === String(jobFilter)) ?? null;
  }, [jobFilter, jobs]);

  const clearJobFilter = useCallback(() => setJobFilter(ALL), []);

  return {
    ...listing,
    viewMode,
    setViewMode,
    jobFilter,
    setJobFilter,
    activeJobFilter,
    clearJobFilter,
    jobs,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    activeApplication: listing.activeItem,
    activeApplicationId: listing.activeItemId,
    openApplication: listing.openItem,
    closeApplication: listing.closeItem,
    updateApplication: jobApplicationsApi.update,
    downloadCv: jobApplicationsApi.downloadCv,
  };
}
