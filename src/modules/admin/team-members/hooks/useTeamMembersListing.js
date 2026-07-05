import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminTeamMembers, teamDepartments } from '../mock/teamMembersData';

const ALL = 'all';

function sortMembers(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'name_asc':
      return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
    case 'name_desc':
      return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName));
    case 'experience_desc':
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    case 'experience_asc':
      return sorted.sort((a, b) => a.experienceYears - b.experienceYears);
    case 'order_asc':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

function matchesExperienceFilter(member, filter) {
  if (filter === ALL) return true;
  const threshold = Number(filter.replace('+', ''));
  return member.experienceYears >= threshold;
}

export function useTeamMembersListing({ items = adminTeamMembers, initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [experienceFilter, setExperienceFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState(null);

  const departments = useMemo(() => teamDepartments, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((member) => {
      if (departmentFilter !== ALL && member.department !== departmentFilter) return false;
      if (categoryFilter !== ALL && member.category !== categoryFilter) return false;
      if (statusFilter !== ALL && member.status !== statusFilter) return false;
      if (!matchesExperienceFilter(member, experienceFilter)) return false;

      if (!query) return true;

      const searchable = [
        member.fullName,
        member.slug,
        member.position,
        member.department,
        member.categoryLabel,
        member.email,
        member.phone,
        member.biographyPreview,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortMembers(result, sortBy);
  }, [
    items,
    searchQuery,
    departmentFilter,
    categoryFilter,
    statusFilter,
    experienceFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeMember = useMemo(
    () => items.find((member) => member.id === activeMemberId) ?? null,
    [items, activeMemberId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    departmentFilter,
    categoryFilter,
    statusFilter,
    experienceFilter,
    sortBy,
    perPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return [
      {
        id: 'total',
        label: 'Total Members',
        value: items.length,
        helper: 'Directory profiles',
      },
      {
        id: 'active',
        label: 'Active',
        value: items.filter((member) => member.status === 'active').length,
        helper: 'Visible on website',
      },
      {
        id: 'hidden',
        label: 'Hidden',
        value: items.filter((member) => member.status === 'hidden').length,
        helper: 'Not publicly listed',
      },
      {
        id: 'departments',
        label: 'Departments',
        value: departments.length,
        helper: 'Active divisions',
      },
      {
        id: 'leadership',
        label: 'Leadership',
        value: items.filter((member) => member.category === 'leadership').length,
        helper: 'Executive & partners',
      },
      {
        id: 'recent',
        label: 'Recently Updated',
        value: items.filter((member) => new Date(member.lastUpdated).getTime() >= weekAgo).length,
        helper: 'Last 7 days',
      },
    ];
  }, [items, departments]);

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
      const pageIds = paginatedItems.map((member) => member.id);
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
    () => paginatedItems.length > 0 && paginatedItems.every((member) => selectedIds.has(member.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((member) => selectedIds.has(member.id)),
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

  const openMember = useCallback((id) => setActiveMemberId(id), []);
  const closeMember = useCallback(() => setActiveMemberId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
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
    departments,
    filteredItems,
    paginatedItems,
    totalPages,
    statistics,
    totalItems: filteredItems.length,
    activeMember,
    activeMemberId,
    openMember,
    closeMember,
  };
}
