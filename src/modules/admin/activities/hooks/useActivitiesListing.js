import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminActivities } from '../mock/activitiesData';

const ALL = 'all';

function matchesGallerySize(count, filter) {
  if (filter === 'small') return count >= 1 && count <= 3;
  if (filter === 'medium') return count >= 4 && count <= 7;
  if (filter === 'large') return count >= 8;
  return true;
}

function sortActivities(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'date_asc':
      return sorted.sort((a, b) => a.activityYear - b.activityYear);
    case 'date_desc':
      return sorted.sort((a, b) => b.activityYear - a.activityYear);
    case 'order_asc':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    case 'gallery_desc':
      return sorted.sort((a, b) => b.galleryCount - a.galleryCount);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

export function useActivitiesListing({ items = adminActivities, initialPerPage = 8 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [featuredFilter, setFeaturedFilter] = useState(ALL);
  const [yearFilter, setYearFilter] = useState(ALL);
  const [gallerySizeFilter, setGallerySizeFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeActivityId, setActiveActivityId] = useState(null);

  const years = useMemo(
    () => [...new Set(items.map((item) => String(item.activityYear)))].sort((a, b) => Number(b) - Number(a)),
    [items],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((item) => {
      if (statusFilter !== ALL && item.status !== statusFilter) return false;
      if (featuredFilter === 'featured' && !item.featured) return false;
      if (featuredFilter === 'not-featured' && item.featured) return false;
      if (yearFilter !== ALL && String(item.activityYear) !== yearFilter) return false;
      if (!matchesGallerySize(item.galleryCount, gallerySizeFilter)) return false;

      if (!query) return true;

      const searchable = [
        item.title,
        item.slug,
        item.location,
        item.activityDate,
        item.description,
        item.descriptionPreview,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortActivities(result, sortBy);
  }, [
    items,
    searchQuery,
    statusFilter,
    featuredFilter,
    yearFilter,
    gallerySizeFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeActivity = useMemo(
    () => items.find((item) => item.id === activeActivityId) ?? null,
    [items, activeActivityId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    featuredFilter,
    yearFilter,
    gallerySizeFilter,
    sortBy,
    perPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const totalGalleryImages = items.reduce((sum, item) => sum + item.galleryCount, 0);

    return [
      { id: 'total', label: 'Total Activities', value: items.length, helper: 'Event entries' },
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
        helper: 'Highlighted events',
      },
      {
        id: 'draft',
        label: 'Draft',
        value: items.filter((item) => item.status === 'draft').length,
        helper: 'Awaiting review',
      },
      {
        id: 'galleries',
        label: 'Galleries',
        value: totalGalleryImages,
        helper: 'Total images',
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

  const openActivity = useCallback((id) => setActiveActivityId(id), []);
  const closeActivity = useCallback(() => setActiveActivityId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    yearFilter,
    setYearFilter,
    gallerySizeFilter,
    setGallerySizeFilter,
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
    years,
    filteredItems,
    paginatedItems,
    totalPages,
    statistics,
    totalItems: filteredItems.length,
    activeActivity,
    activeActivityId,
    openActivity,
    closeActivity,
  };
}
