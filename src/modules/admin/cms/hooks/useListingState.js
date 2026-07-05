import { useCallback, useEffect, useMemo, useState } from 'react';

const ALL = 'all';

function sortItems(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

export function useListingState({
  items,
  searchKeys = ['title', 'subtitle', 'category'],
  initialPerPage = 10,
}) {
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('updated_desc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))].sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((item) => {
      if (statusFilter !== ALL && item.status !== statusFilter) return false;
      if (categoryFilter !== ALL && item.category !== categoryFilter) return false;
      if (!query) return true;

      return searchKeys.some((key) => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(query);
      });
    });

    return sortItems(result, sortBy);
  }, [items, searchQuery, statusFilter, categoryFilter, sortBy, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, sortBy, perPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return [
      { id: 'total', label: 'Total Items', value: items.length, helper: 'All records' },
      {
        id: 'published',
        label: 'Published',
        value: items.filter((item) => item.status === 'published').length,
        helper: 'Live content',
      },
      {
        id: 'draft',
        label: 'Draft',
        value: items.filter((item) => item.status === 'draft').length,
        helper: 'Unpublished',
      },
      {
        id: 'archived',
        label: 'Archived',
        value: items.filter((item) => item.status === 'archived').length,
        helper: 'Inactive',
      },
      {
        id: 'recent',
        label: 'Recently Updated',
        value: items.filter((item) => new Date(item.updatedAt).getTime() >= weekAgo).length,
        helper: 'Last 7 days',
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
      const pageIds = paginatedItems.map((item) => item.id);
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

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllPageSelected = useMemo(() => {
    if (paginatedItems.length === 0) return false;
    return paginatedItems.every((item) => selectedIds.has(item.id));
  }, [paginatedItems, selectedIds]);

  const isSomePageSelected = useMemo(() => {
    return paginatedItems.some((item) => selectedIds.has(item.id));
  }, [paginatedItems, selectedIds]);

  const simulateRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  const openDeleteModal = useCallback(() => {
    if (selectedIds.size > 0) setDeleteModalOpen(true);
  }, [selectedIds.size]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
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
    closeDeleteModal,
    categories,
    filteredItems,
    paginatedItems,
    totalPages,
    statistics,
    totalItems: filteredItems.length,
  };
}
