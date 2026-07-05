import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminProjects, projectCategories } from '../mock/projectsData';

const ALL = 'all';

function sortProjects(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'year_asc':
      return sorted.sort((a, b) => a.year - b.year);
    case 'year_desc':
      return sorted.sort((a, b) => b.year - a.year);
    case 'order_asc':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

export function useProjectsListing({ items = adminProjects, initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [featuredFilter, setFeaturedFilter] = useState(ALL);
  const [publishedFilter, setPublishedFilter] = useState(ALL);
  const [yearFilter, setYearFilter] = useState(ALL);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('updated_desc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))].sort(),
    [items],
  );

  const years = useMemo(
    () => [...new Set(items.map((item) => String(item.year)))].sort((a, b) => Number(b) - Number(a)),
    [items],
  );

  const projectTypes = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item.projectType)
          .filter((type) => type && type.length > 1 && type !== '-'),
      ),
    ].sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((item) => {
      if (statusFilter !== ALL && item.status !== statusFilter) return false;
      if (categoryFilter !== ALL && item.category !== categoryFilter) return false;
      if (featuredFilter === 'featured' && !item.featured) return false;
      if (featuredFilter === 'not-featured' && item.featured) return false;
      if (publishedFilter === 'published' && !item.published) return false;
      if (publishedFilter === 'unpublished' && item.published) return false;
      if (yearFilter !== ALL && String(item.year) !== yearFilter) return false;
      if (typeFilter !== ALL && item.projectType !== typeFilter) return false;

      if (!query) return true;

      const searchable = [
        item.title,
        item.slug,
        item.category,
        item.location,
        item.projectType,
        item.description,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortProjects(result, sortBy);
  }, [
    items,
    searchQuery,
    statusFilter,
    categoryFilter,
    featuredFilter,
    publishedFilter,
    yearFilter,
    typeFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeProject = useMemo(
    () => items.find((item) => item.id === activeProjectId) ?? null,
    [items, activeProjectId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    featuredFilter,
    publishedFilter,
    yearFilter,
    typeFilter,
    sortBy,
    perPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return [
      { id: 'total', label: 'Total Projects', value: items.length, helper: 'Portfolio entries' },
      {
        id: 'published',
        label: 'Published',
        value: items.filter((item) => item.published).length,
        helper: 'Live on website',
      },
      {
        id: 'featured',
        label: 'Featured',
        value: items.filter((item) => item.featured).length,
        helper: 'Highlighted projects',
      },
      {
        id: 'draft',
        label: 'Draft',
        value: items.filter((item) => item.status === 'draft').length,
        helper: 'Awaiting review',
      },
      {
        id: 'categories',
        label: 'Categories',
        value: projectCategories.length,
        helper: 'Active groupings',
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

  const openProject = useCallback((id) => setActiveProjectId(id), []);
  const closeProject = useCallback(() => setActiveProjectId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
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
    categories,
    years,
    projectTypes,
    filteredItems,
    paginatedItems,
    totalPages,
    statistics,
    totalItems: filteredItems.length,
    activeProject,
    activeProjectId,
    openProject,
    closeProject,
  };
}
