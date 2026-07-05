import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApplications } from '../mock/applicationsData';

const ALL = 'all';

const STATUS_ORDER = { new: 0, reviewed: 1, shortlisted: 2, hired: 3, rejected: 4 };

function matchesExperience(years, filter) {
  if (filter === ALL) return true;
  if (filter === '0-2') return years <= 2;
  if (filter === '3-5') return years >= 3 && years <= 5;
  if (filter === '6-10') return years >= 6 && years <= 10;
  if (filter === '10+') return years > 10;
  return true;
}

function matchesSubmittedDate(dateStr, filter) {
  if (filter === ALL) return true;
  const days = parseInt(filter, 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(`${dateStr}T00:00:00`) >= cutoff;
}

function sortApplications(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'name_asc':
      return sorted.sort((a, b) => a.applicantName.localeCompare(b.applicantName));
    case 'name_desc':
      return sorted.sort((a, b) => b.applicantName.localeCompare(a.applicantName));
    case 'submitted_asc':
      return sorted.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));
    case 'experience_desc':
      return sorted.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    case 'experience_asc':
      return sorted.sort((a, b) => a.yearsOfExperience - b.yearsOfExperience);
    case 'updated_desc':
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    case 'status_asc':
      return sorted.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
    case 'submitted_desc':
    default:
      return sorted.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
  }
}

function getInitialViewMode() {
  if (typeof window === 'undefined') return 'table';
  return window.innerWidth <= 768 ? 'card' : 'table';
}

export function useApplicationsListing({
  items = adminApplications,
  initialPerPage = 12,
  initialJobFilter = ALL,
} = {}) {
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState(initialJobFilter);
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [experienceFilter, setExperienceFilter] = useState(ALL);
  const [submittedDateFilter, setSubmittedDateFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('submitted_desc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeApplicationId, setActiveApplicationId] = useState(null);

  useEffect(() => {
    if (initialJobFilter !== ALL) {
      setJobFilter(initialJobFilter);
    }
  }, [initialJobFilter]);

  const departments = useMemo(
    () => [...new Set(items.map((app) => app.department))].sort(),
    [items],
  );

  const jobs = useMemo(() => {
    const map = new Map();
    items.forEach((app) => {
      if (!map.has(app.jobId)) {
        map.set(app.jobId, { id: app.jobId, title: app.jobTitle });
      }
    });
    return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((app) => {
      if (jobFilter !== ALL && String(app.jobId) !== String(jobFilter)) return false;
      if (departmentFilter !== ALL && app.department !== departmentFilter) return false;
      if (statusFilter !== ALL && app.status !== statusFilter) return false;
      if (!matchesExperience(app.yearsOfExperience, experienceFilter)) return false;
      if (!matchesSubmittedDate(app.submittedDate, submittedDateFilter)) return false;

      if (!query) return true;

      const searchable = [
        app.applicantName,
        app.email,
        app.phone,
        app.location,
        app.jobTitle,
        app.department,
        app.coverLetterPreview,
        app.source,
        app.cvFileName,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortApplications(result, sortBy);
  }, [
    items,
    searchQuery,
    jobFilter,
    departmentFilter,
    statusFilter,
    experienceFilter,
    submittedDateFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeApplication = useMemo(
    () => items.find((app) => app.id === activeApplicationId) ?? null,
    [items, activeApplicationId],
  );

  const activeJobFilter = useMemo(() => {
    if (jobFilter === ALL) return null;
    return jobs.find((job) => String(job.id) === String(jobFilter)) ?? null;
  }, [jobFilter, jobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    jobFilter,
    departmentFilter,
    statusFilter,
    experienceFilter,
    submittedDateFilter,
    sortBy,
    perPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => [
    {
      id: 'total',
      label: 'Total Applications',
      value: items.length,
      helper: 'All candidates',
    },
    {
      id: 'new',
      label: 'New',
      value: items.filter((app) => app.status === 'new').length,
      helper: 'Awaiting review',
    },
    {
      id: 'reviewed',
      label: 'Reviewed',
      value: items.filter((app) => app.status === 'reviewed').length,
      helper: 'Initial screening done',
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      value: items.filter((app) => app.status === 'shortlisted').length,
      helper: 'In interview pipeline',
    },
    {
      id: 'hired',
      label: 'Hired',
      value: items.filter((app) => app.status === 'hired').length,
      helper: 'Offers accepted',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      value: items.filter((app) => app.status === 'rejected').length,
      helper: 'Not moving forward',
    },
  ], [items]);

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
      const pageIds = paginatedItems.map((app) => app.id);
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
    () => paginatedItems.length > 0 && paginatedItems.every((app) => selectedIds.has(app.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((app) => selectedIds.has(app.id)),
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

  const openApplication = useCallback((id) => setActiveApplicationId(id), []);
  const closeApplication = useCallback(() => setActiveApplicationId(null), []);

  const clearJobFilter = useCallback(() => setJobFilter(ALL), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    jobFilter,
    setJobFilter,
    activeJobFilter,
    clearJobFilter,
    departmentFilter,
    setDepartmentFilter,
    departments,
    jobs,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    submittedDateFilter,
    setSubmittedDateFilter,
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
    activeApplication,
    activeApplicationId,
    openApplication,
    closeApplication,
  };
}
