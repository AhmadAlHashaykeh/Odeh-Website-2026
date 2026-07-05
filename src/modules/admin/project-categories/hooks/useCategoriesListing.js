import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminCategories } from '../mock/categoriesData';

const ALL = 'all';

function sortCategories(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'projects_asc':
      return sorted.sort((a, b) => a.projectCount - b.projectCount);
    case 'projects_desc':
      return sorted.sort((a, b) => b.projectCount - a.projectCount);
    case 'order_asc':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

export function useCategoriesListing({ items = adminCategories, initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [seoFilter, setSeoFilter] = useState(ALL);
  const [projectCountFilter, setProjectCountFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((item) => {
      if (statusFilter === 'published' && !item.published) return false;
      if (statusFilter === 'hidden' && item.published) return false;
      if (seoFilter !== ALL && item.seoStatus !== seoFilter) return false;
      if (projectCountFilter === 'with-projects' && item.projectCount === 0) return false;
      if (projectCountFilter === 'empty' && item.projectCount > 0) return false;

      if (!query) return true;

      const searchable = [item.title, item.slug, item.description];
      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortCategories(result, sortBy);
  }, [items, searchQuery, statusFilter, seoFilter, projectCountFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeCategory = useMemo(
    () => items.find((item) => item.id === activeCategoryId) ?? null,
    [items, activeCategoryId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, seoFilter, projectCountFilter, sortBy, perPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const totalProjects = items.reduce((sum, item) => sum + item.projectCount, 0);

    return [
      { id: 'total', label: 'Total Categories', value: items.length, helper: 'Portfolio groupings' },
      {
        id: 'published',
        label: 'Published',
        value: items.filter((item) => item.published).length,
        helper: 'Visible on website',
      },
      {
        id: 'hidden',
        label: 'Hidden',
        value: items.filter((item) => !item.published).length,
        helper: 'Not publicly visible',
      },
      {
        id: 'projects',
        label: 'Projects Assigned',
        value: totalProjects,
        helper: 'Across all categories',
      },
      {
        id: 'empty',
        label: 'Without Projects',
        value: items.filter((item) => item.projectCount === 0).length,
        helper: 'Needs content',
      },
      {
        id: 'recent',
        label: 'Recently Updated',
        value: items.filter((item) => new Date(item.lastUpdated).getTime() >= weekAgo).length,
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

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const isAllPageSelected = useMemo(
    () => paginatedItems.length > 0 && paginatedItems.every((item) => selectedIds.has(item.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((item) => selectedIds.has(item.id)),
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

  const openCategory = useCallback((id) => setActiveCategoryId(id), []);
  const closeCategory = useCallback(() => setActiveCategoryId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    seoFilter,
    setSeoFilter,
    projectCountFilter,
    setProjectCountFilter,
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
    activeCategory,
    openCategory,
    closeCategory,
  };
}
