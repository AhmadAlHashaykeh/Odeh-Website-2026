import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminContactMessages } from '../mock/contactMessagesData';

const ALL = 'all';

const STATUS_ORDER = { new: 0, read: 1, replied: 2, archived: 3 };
const PRIORITY_ORDER = { urgent: 0, high: 1, normal: 2 };

function matchesSubmittedDate(dateStr, filter) {
  if (filter === ALL) return true;
  const days = parseInt(filter, 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(`${dateStr}T00:00:00`) >= cutoff;
}

function sortMessages(items, sortBy) {
  const sorted = [...items];

  switch (sortBy) {
    case 'name_asc':
      return sorted.sort((a, b) => a.senderName.localeCompare(b.senderName));
    case 'name_desc':
      return sorted.sort((a, b) => b.senderName.localeCompare(a.senderName));
    case 'submitted_asc':
      return sorted.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));
    case 'priority_desc':
      return sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));
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

export function useContactMessagesListing({
  items = adminContactMessages,
  initialPerPage = 12,
} = {}) {
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [priorityFilter, setPriorityFilter] = useState(ALL);
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState(ALL);
  const [assignedToFilter, setAssignedToFilter] = useState(ALL);
  const [submittedDateFilter, setSubmittedDateFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('submitted_desc');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);

  const assignees = useMemo(() => {
    const names = [...new Set(items.map((msg) => msg.assignedTo).filter(Boolean))].sort();
    return names;
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = items.filter((msg) => {
      if (statusFilter !== ALL && msg.status !== statusFilter) return false;
      if (priorityFilter !== ALL && msg.priority !== priorityFilter) return false;
      if (inquiryTypeFilter !== ALL && msg.inquiryType !== inquiryTypeFilter) return false;
      if (assignedToFilter !== ALL) {
        if (assignedToFilter === 'unassigned' && msg.assignedTo) return false;
        if (assignedToFilter !== 'unassigned' && msg.assignedTo !== assignedToFilter) return false;
      }
      if (!matchesSubmittedDate(msg.submittedDate, submittedDateFilter)) return false;

      if (!query) return true;

      const searchable = [
        msg.senderName,
        msg.email,
        msg.phone,
        msg.company,
        msg.subject,
        msg.message,
        msg.inquiryType,
        msg.assignedTo,
        msg.sourcePage,
      ];

      return searchable.some((value) => value && String(value).toLowerCase().includes(query));
    });

    return sortMessages(result, sortBy);
  }, [
    items,
    searchQuery,
    statusFilter,
    priorityFilter,
    inquiryTypeFilter,
    assignedToFilter,
    submittedDateFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, currentPage, perPage]);

  const activeMessage = useMemo(
    () => items.find((msg) => msg.id === activeMessageId) ?? null,
    [items, activeMessageId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    priorityFilter,
    inquiryTypeFilter,
    assignedToFilter,
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
      label: 'Total Messages',
      value: items.length,
      helper: 'All inquiries',
    },
    {
      id: 'new',
      label: 'New',
      value: items.filter((msg) => msg.status === 'new').length,
      helper: 'Awaiting review',
    },
    {
      id: 'read',
      label: 'Read',
      value: items.filter((msg) => msg.status === 'read').length,
      helper: 'Opened by team',
    },
    {
      id: 'replied',
      label: 'Replied',
      value: items.filter((msg) => msg.status === 'replied').length,
      helper: 'Response sent',
    },
    {
      id: 'archived',
      label: 'Archived',
      value: items.filter((msg) => msg.status === 'archived').length,
      helper: 'Closed inquiries',
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      value: items.filter((msg) => msg.priority === 'high' || msg.priority === 'urgent').length,
      helper: 'High & urgent',
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
      const pageIds = paginatedItems.map((msg) => msg.id);
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
    () => paginatedItems.length > 0 && paginatedItems.every((msg) => selectedIds.has(msg.id)),
    [paginatedItems, selectedIds],
  );

  const isSomePageSelected = useMemo(
    () => paginatedItems.some((msg) => selectedIds.has(msg.id)),
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

  const openMessage = useCallback((id) => setActiveMessageId(id), []);
  const closeMessage = useCallback(() => setActiveMessageId(null), []);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    inquiryTypeFilter,
    setInquiryTypeFilter,
    assignedToFilter,
    setAssignedToFilter,
    assignees,
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
    activeMessage,
    activeMessageId,
    openMessage,
    closeMessage,
  };
}
