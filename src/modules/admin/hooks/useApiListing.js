import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError } from '../../../api/client';
import { useDebouncedValue } from './useDebouncedValue';

const DEFAULT_META = {
  currentPage: 1,
  perPage: 12,
  total: 0,
  lastPage: 1,
};

export function useApiListing({
  listFn,
  destroyFn,
  showFn,
  buildQueryParams,
  queryState = {},
  initialPerPage = 12,
  statisticsFn,
}) {
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 350);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ ...DEFAULT_META, perPage: initialPerPage });
  const [statistics, setStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listError, setListError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const hasLoadedRef = useRef(false);

  const queryParams = useMemo(
    () =>
      buildQueryParams({
        ...queryState,
        page: currentPage,
        perPage,
        search: debouncedSearch.trim(),
      }),
    [buildQueryParams, queryState, currentPage, perPage, debouncedSearch],
  );

  const fetchList = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent && !hasLoadedRef.current) {
        setIsLoading(true);
      } else if (silent) {
        setIsRefreshing(true);
      }

      setListError(null);

      try {
        const response = await listFn(queryParams);
        setItems(response.data);
        setMeta(response.meta);
        hasLoadedRef.current = true;
      } catch (error) {
        setListError(error instanceof ApiError ? error.message : 'Failed to load items.');
        setItems([]);
        setMeta((prev) => ({ ...prev, total: 0, lastPage: 1 }));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [listFn, queryParams],
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, perPage, queryState]);

  useEffect(() => {
    if (!statisticsFn) {
      return undefined;
    }

    let cancelled = false;

    statisticsFn()
      .then((stats) => {
        if (!cancelled) {
          setStatistics(stats);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatistics([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [statisticsFn, meta.total]);

  const refresh = useCallback(() => fetchList({ silent: true }), [fetchList]);

  const paginatedItems = items;
  const totalPages = meta.lastPage || 1;
  const totalItems = meta.total || 0;

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
      const allSelected = pageIds.length > 0 && pageIds.every((id) => prev.has(id));

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

  const openDeleteModal = useCallback(() => {
    if (selectedIds.size > 0) setDeleteModalOpen(true);
  }, [selectedIds.size]);

  const openDeleteForItem = useCallback((item) => {
    setSelectedIds(new Set([item.id]));
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isDeleting) setDeleteModalOpen(false);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!destroyFn || selectedIds.size === 0) {
      return { success: false };
    }

    setIsDeleting(true);

    try {
      const ids = [...selectedIds];
      await Promise.all(ids.map((id) => destroyFn(id)));

      const remainingOnPage = paginatedItems.length - ids.length;
      if (remainingOnPage === 0 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      } else {
        await fetchList({ silent: true });
      }

      setDeleteModalOpen(false);
      clearSelection();
      return { success: true, count: ids.length };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : 'Failed to delete selected items.',
      };
    } finally {
      setIsDeleting(false);
    }
  }, [
    destroyFn,
    selectedIds,
    paginatedItems.length,
    currentPage,
    fetchList,
    clearSelection,
  ]);

  const openItem = useCallback(
    async (id) => {
      setActiveItemId(id);

      if (!showFn) {
        setActiveItem(items.find((item) => item.id === id) ?? null);
        return;
      }

      try {
        const response = await showFn(id);
        setActiveItem(response.data);
      } catch {
        setActiveItem(items.find((item) => item.id === id) ?? null);
      }
    },
    [showFn, items],
  );

  const closeItem = useCallback(() => {
    setActiveItemId(null);
    setActiveItem(null);
  }, []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    isLoading,
    isRefreshing,
    listError,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    isAllPageSelected,
    isSomePageSelected,
    deleteModalOpen,
    isDeleting,
    openDeleteModal,
    openDeleteForItem,
    closeDeleteModal,
    confirmDelete,
    paginatedItems,
    filteredItems: paginatedItems,
    totalPages,
    totalItems,
    statistics,
    refresh,
    activeItem,
    activeItemId,
    openItem,
    closeItem,
  };
}
