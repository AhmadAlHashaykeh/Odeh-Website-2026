import { useCallback, useEffect, useMemo, useState } from 'react';
import * as contactMessagesApi from '../../../../api/contactMessages';
import * as usersApi from '../../../../api/users';
import { COMMON_SORT_MAP, mapSortKey } from '../../../../api/utils';
import { useApiListing } from '../../hooks/useApiListing';
import { buildCountStatistics } from '../../hooks/listingStatistics';

const ALL = 'all';

const SORT_MAP = {
  ...COMMON_SORT_MAP,
  submitted_asc: 'created_at',
  submitted_desc: '-created_at',
  priority_desc: '-priority',
  updated_desc: '-updated_at',
  status_asc: 'status',
};

function mapContactMessage(message) {
  return {
    ...message,
    senderName: message.fullName,
    submittedDate: message.submittedAt?.split('T')[0] ?? message.submittedAt,
    assignedTo: message.assignedUser?.fullName ?? null,
  };
}

function getInitialViewMode() {
  return 'table';
}

export function useContactMessagesListing({ initialPerPage = 12 } = {}) {
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [priorityFilter, setPriorityFilter] = useState(ALL);
  const [assignedToFilter, setAssignedToFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState('submitted_desc');
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    let cancelled = false;

    usersApi
      .list({ per_page: 50, status: 'active' })
      .then((response) => {
        if (cancelled) return;
        setAssignees(response.data);
      })
      .catch(() => {
        if (!cancelled) setAssignees([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const queryState = useMemo(
    () => ({
      statusFilter,
      priorityFilter,
      assignedToFilter,
      sortBy,
    }),
    [statusFilter, priorityFilter, assignedToFilter, sortBy],
  );

  const buildQueryParams = useCallback(
    ({
      page,
      perPage,
      search,
      statusFilter: status,
      priorityFilter: priority,
      assignedToFilter: assignedUser,
      sortBy: sort,
    }) => {
      const params = {
        page,
        per_page: perPage,
        sort: mapSortKey(sort, SORT_MAP),
      };

      if (search) params.search = search;
      if (status !== ALL) params.status = status;
      if (priority !== ALL) params.priority = priority;
      if (assignedUser === 'unassigned') {
        params.assignedUser = 'null';
      } else if (assignedUser !== ALL) {
        params.assignedUser = assignedUser;
      }

      return params;
    },
    [],
  );

  const listFn = useCallback(async (params) => {
    const response = await contactMessagesApi.list(params);
    return {
      ...response,
      data: response.data.map(mapContactMessage),
    };
  }, []);

  const showFn = useCallback(async (id) => {
    const response = await contactMessagesApi.show(id);
    return { data: mapContactMessage(response.data) };
  }, []);

  const statisticsFn = useCallback(
    () =>
      buildCountStatistics(contactMessagesApi.list, [
        { id: 'total', label: 'Total Messages', helper: 'All inquiries', params: {} },
        { id: 'new', label: 'New', helper: 'Awaiting review', params: { status: 'new' } },
        {
          id: 'in_progress',
          label: 'In Progress',
          helper: 'Being handled',
          params: { status: 'in_progress' },
        },
        {
          id: 'resolved',
          label: 'Resolved',
          helper: 'Closed inquiries',
          params: { status: 'resolved' },
        },
        {
          id: 'high-priority',
          label: 'High Priority',
          helper: 'High & urgent',
          params: { priority: 'high' },
        },
      ]),
    [],
  );

  const listing = useApiListing({
    listFn,
    showFn,
    buildQueryParams,
    queryState,
    initialPerPage,
    statisticsFn,
  });

  return {
    ...listing,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assignedToFilter,
    setAssignedToFilter,
    assignees,
    sortBy,
    setSortBy,
    simulateRefresh: listing.refresh,
    activeMessage: listing.activeItem,
    activeMessageId: listing.activeItemId,
    openMessage: listing.openItem,
    closeMessage: listing.closeItem,
    updateMessage: contactMessagesApi.update,
  };
}
