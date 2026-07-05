import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminJobs, isClosingSoon } from '../mock/careersData';

const ALL = 'all';

function sortJobs(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'posted_asc':
      return sorted.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    case 'posted_desc':
      return sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    case 'closing_asc':
      return sorted.sort((a, b) => new Date(a.closingDate) - new Date(b.closingDate));
    case 'closing_desc':
      return sorted.sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
    case 'applications_desc':
      return sorted.sort((a, b) => b.applicationsCount - a.applicationsCount);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

export function useCareersListing({ items = adminJobs, initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState(ALL);
  const [workModeFilter, setWorkModeFilter] = useState(ALL);
  const [experienceFilter, setExperienceFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('posted_desc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);

  const departments = useMemo(
    () => [...new Set(items.map((job) => job.department))].sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((job) => {
      if (departmentFilter !== ALL && job.department !== departmentFilter) return false;
      if (statusFilter !== ALL && job.status !== statusFilter) return false;
      if (employmentTypeFilter !== ALL && job.employmentType !== employmentTypeFilter) return false;
      if (workModeFilter !== ALL && job.workMode !== workModeFilter) return false;
      if (experienceFilter !== ALL && job.experienceLevel !== experienceFilter) return false;

      if (!query) return true;

      const searchable = [
        job.title,
        job.slug,
        job.department,
        job.location,
        job.shortDescription,
        job.fullDescription,
        job.employmentType,
        job.workMode,
        job.experienceLevel,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortJobs(result, sortBy);
  }, [
    items,
    searchQuery,
    departmentFilter,
    statusFilter,
    employmentTypeFilter,
    workModeFilter,
    experienceFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeJob = useMemo(
    () => items.find((job) => job.id === activeJobId) ?? null,
    [items, activeJobId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    departmentFilter,
    statusFilter,
    employmentTypeFilter,
    workModeFilter,
    experienceFilter,
    sortBy,
    perPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const openJobs = items.filter((job) => job.status === 'open');
    const closingSoonCount = openJobs.filter((job) => isClosingSoon(job.closingDate)).length;

    return [
      {
        id: 'total',
        label: 'Total Jobs',
        value: items.length,
        helper: 'All listings',
      },
      {
        id: 'open',
        label: 'Open Jobs',
        value: openJobs.length,
        helper: 'Accepting applications',
      },
      {
        id: 'closed',
        label: 'Closed Jobs',
        value: items.filter((job) => job.status === 'closed').length,
        helper: 'No longer accepting',
      },
      {
        id: 'draft',
        label: 'Draft Jobs',
        value: items.filter((job) => job.status === 'draft').length,
        helper: 'Not yet published',
      },
      {
        id: 'applications',
        label: 'Applications',
        value: items.reduce((sum, job) => sum + job.applicationsCount, 0),
        helper: 'Total received',
      },
      {
        id: 'closing-soon',
        label: 'Closing Soon',
        value: closingSoonCount,
        helper: 'Within 14 days',
      },
    ];
  }, [items]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const pageIds = paginatedItems.map((job) => job.id);
      const allSelected = pageIds.every((id) => prev.has(id));

      if (allSelected) {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      }

      const next = new Set(prev);
      pageIds.forEach((id) => next.add(id));
      return next;
    });
  }, [paginatedItems]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const isAllPageSelected = useMemo(
    () => paginatedItems.length > 0 && paginatedItems.every((job) => selectedIds.has(job.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((job) => selectedIds.has(job.id)),
    [paginatedItems, selectedIds],
  );

  const simulateRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  const openDeleteModal = useCallback(() => {
    if (selectedIds.size > 0) setDeleteModalOpen(true);
  }, [selectedIds.size]);

  const openDeleteForItem = useCallback((item) => {
    setSelectedIds(new Set([item.id]));
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => setDeleteModalOpen(false), []);

  const openJob = useCallback((id) => setActiveJobId(id), []);
  const closeJob = useCallback(() => setActiveJobId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    departments,
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
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    isAllPageSelected,
    isSomePageSelected,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    isLoading,
    simulateRefresh,
    deleteModalOpen,
    openDeleteModal,
    openDeleteForItem,
    closeDeleteModal,
    filteredItems,
    paginatedItems,
    totalPages,
    statistics,
    totalItems: filteredItems.length,
    activeJob,
    activeJobId,
    openJob,
    closeJob,
  };
}
