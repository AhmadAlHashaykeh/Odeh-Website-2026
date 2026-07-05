import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminServices } from '../mock/servicesData';

const ALL = 'all';

function sortServices(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'order_asc':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    case 'updated_asc':
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case 'updated_desc':
    default:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
}

export function useServicesListing({ items = adminServices, initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [homepageFilter, setHomepageFilter] = useState(ALL);
  const [seoFilter, setSeoFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('order_asc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((service) => {
      if (statusFilter !== ALL && service.status !== statusFilter) return false;
      if (homepageFilter === 'yes' && !service.usedOnHomepage) return false;
      if (homepageFilter === 'no' && service.usedOnHomepage) return false;
      if (seoFilter !== ALL && service.seoStatus !== seoFilter) return false;

      if (!query) return true;

      const searchable = [
        service.title,
        service.slug,
        service.description,
        service.descriptionPreview,
        service.metaTitle,
        service.metaDescription,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortServices(result, sortBy);
  }, [items, searchQuery, statusFilter, homepageFilter, seoFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeService = useMemo(
    () => items.find((service) => service.id === activeServiceId) ?? null,
    [items, activeServiceId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, homepageFilter, seoFilter, sortBy, perPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const statistics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return [
      {
        id: 'total',
        label: 'Total Services',
        value: items.length,
        helper: 'Engineering offerings',
      },
      {
        id: 'published',
        label: 'Published',
        value: items.filter((service) => service.status === 'published').length,
        helper: 'Live on website',
      },
      {
        id: 'hidden',
        label: 'Hidden',
        value: items.filter((service) => service.status === 'hidden').length,
        helper: 'Not publicly listed',
      },
      {
        id: 'homepage',
        label: 'Used On Homepage',
        value: items.filter((service) => service.usedOnHomepage).length,
        helper: 'Carousel visibility',
      },
      {
        id: 'draft',
        label: 'Draft',
        value: items.filter((service) => service.status === 'draft').length,
        helper: 'In progress',
      },
      {
        id: 'recent',
        label: 'Recently Updated',
        value: items.filter((service) => new Date(service.lastUpdated).getTime() >= weekAgo).length,
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
      const pageIds = paginatedItems.map((service) => service.id);
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
    () => paginatedItems.length > 0 && paginatedItems.every((service) => selectedIds.has(service.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((service) => selectedIds.has(service.id)),
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

  const openService = useCallback((id) => setActiveServiceId(id), []);
  const closeService = useCallback(() => setActiveServiceId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    homepageFilter,
    setHomepageFilter,
    seoFilter,
    setSeoFilter,
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
    activeService,
    activeServiceId,
    openService,
    closeService,
  };
}
