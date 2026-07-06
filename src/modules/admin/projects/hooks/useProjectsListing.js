import { useCallback, useEffect, useMemo, useState } from 'react';
import * as projectsApi from '../../../../api/projects';
import * as projectCategoriesApi from '../../../../api/projectCategories';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  year_asc: 'year',
  year_desc: '-year',
};

export function useProjectsListing({ initialPerPage = 10 } = {}) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [featuredFilter, setFeaturedFilter] = useState(ALL);
  const [publishedFilter, setPublishedFilter] = useState(ALL);
  const [yearFilter, setYearFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('updated_desc');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [facetOptions, setFacetOptions] = useState({ years: [], projectTypes: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const [categoriesResponse, facetsResponse] = await Promise.all([
          projectCategoriesApi.list({ per_page: 50 }),
          projectsApi.list({ per_page: 50 }),
        ]);

        if (cancelled) return;

        setCategoryOptions(categoriesResponse.data);

        const years = [
          ...new Set(
            facetsResponse.data
              .map((item) => item.year)
              .filter(Boolean)
              .map(String),
          ),
        ].sort((a, b) => Number(b) - Number(a));

        const projectTypes = [
          ...new Set(
            facetsResponse.data
              .map((item) => item.projectType)
              .filter((type) => type && type.length > 1 && type !== '-'),
          ),
        ].sort();

        setFacetOptions({ years, projectTypes });
      } catch {
        if (!cancelled) {
          setCategoryOptions([]);
          setFacetOptions({ years: [], projectTypes: [] });
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
      featuredFilter,
      publishedFilter,
      yearFilter,
      typeFilter,
      sortBy,
    }),
    [
      statusFilter,
      categoryFilter,
      featuredFilter,
      publishedFilter,
      yearFilter,
      typeFilter,
      sortBy,
    ],
  );

  const buildQueryParams = useCallback(
    ({
      page,
      perPage,
      search,
      statusFilter: status,
      categoryFilter: category,
      featuredFilter: featured,
      publishedFilter: published,
      yearFilter: year,
      typeFilter: projectType,
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
      if (featured === 'featured') params.featured = true;
      if (featured === 'not-featured') params.featured = false;
      if (published === 'published' && status === ALL) params.status = 'published';
      if (year !== ALL) params.year = year;
      if (projectType !== ALL) params.project_type = projectType;

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
          id: 'featured',
          label: 'Featured',
          helper: 'Highlighted projects',
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
    featuredFilter,
    setFeaturedFilter,
    publishedFilter,
    setPublishedFilter,
    yearFilter,
    setYearFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    categories,
    years: facetOptions.years,
    projectTypes: facetOptions.projectTypes,
    categoryRecords: categoryOptions,
    simulateRefresh: listing.refresh,
    activeProject: listing.activeItem,
    openProject: listing.openItem,
    closeProject: listing.closeItem,
  };
}
