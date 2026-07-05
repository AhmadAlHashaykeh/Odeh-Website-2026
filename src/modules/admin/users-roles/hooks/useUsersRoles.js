import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import {
  computeUsersRolesStatistics,
  BULK_FEEDBACK,
  USER_ACTION_FEEDBACK,
  ROLE_ACTION_FEEDBACK,
  NEW_ROLE_TEMPLATE,
} from '../mock/usersRolesConfig';
import { getInitialUsersRolesData, getUserById, getRoleById } from '../mock/usersRolesData';

function sortUsers(users, sortBy) {
  const sorted = [...users];
  switch (sortBy) {
    case 'name_desc':
      return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName));
    case 'recent_login':
      return sorted.sort((a, b) => {
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return new Date(b.lastLogin) - new Date(a.lastLogin);
      });
    case 'created_desc':
      return sorted.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    case 'name_asc':
    default:
      return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }
}

export function useUsersRoles() {
  const [data, setData] = useState(getInitialUsersRolesData);
  const [activeSection, setActiveSection] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [showEmptyUsers, setShowEmptyUsers] = useState(false);
  const [showEmptyRoles, setShowEmptyRoles] = useState(false);

  const [viewingUserId, setViewingUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [matrixRoleId, setMatrixRoleId] = useState('role-super-admin');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 460);
    return () => clearTimeout(timer);
  }, []);

  const statistics = useMemo(
    () => computeUsersRolesStatistics(data.users, data.roles),
    [data.users, data.roles],
  );

  const filteredUsers = useMemo(() => {
    let result = data.users;

    if (showEmptyUsers) return [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.roleId === roleFilter);
    }

    return sortUsers(result, sortBy);
  }, [data.users, searchQuery, statusFilter, roleFilter, sortBy, showEmptyUsers]);

  const displayRoles = useMemo(
    () => (showEmptyRoles ? [] : data.roles),
    [data.roles, showEmptyRoles],
  );

  const viewingUser = useMemo(
    () => getUserById(data.users, viewingUserId),
    [data.users, viewingUserId],
  );

  const editingUser = useMemo(
    () => getUserById(data.users, editingUserId),
    [data.users, editingUserId],
  );

  const editingRole = useMemo(() => {
    if (roleModalMode === 'create') return NEW_ROLE_TEMPLATE;
    return getRoleById(data.roles, editingRoleId);
  }, [roleModalMode, data.roles, editingRoleId]);

  const matrixRole = useMemo(
    () => getRoleById(data.roles, matrixRoleId),
    [data.roles, matrixRoleId],
  );

  const toggleUserSelect = useCallback((userId) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const toggleSelectAllUsers = useCallback(() => {
    setSelectedUserIds((prev) => {
      if (prev.size === filteredUsers.length) return new Set();
      return new Set(filteredUsers.map((u) => u.id));
    });
  }, [filteredUsers]);

  const clearUserSelection = useCallback(() => {
    setSelectedUserIds(new Set());
  }, []);

  const openInvite = useCallback(() => setInviteModalOpen(true), []);
  const closeInvite = useCallback(() => setInviteModalOpen(false), []);

  const openUserView = useCallback((userId) => setViewingUserId(userId), []);
  const closeUserView = useCallback(() => setViewingUserId(null), []);

  const openUserEdit = useCallback((userId) => setEditingUserId(userId), []);
  const closeUserEdit = useCallback(() => setEditingUserId(null), []);

  const openRoleEdit = useCallback((roleId) => {
    setEditingRoleId(roleId);
    setRoleModalMode('edit');
  }, []);

  const openRoleCreate = useCallback(() => {
    setEditingRoleId(null);
    setRoleModalMode('create');
  }, []);

  const closeRoleModal = useCallback(() => {
    setEditingRoleId(null);
    setRoleModalMode(null);
  }, []);

  const handleUserAction = useCallback(
    (actionId, user) => {
      switch (actionId) {
        case 'view':
          openUserView(user.id);
          break;
        case 'edit':
          openUserEdit(user.id);
          break;
        case 'resend-invite':
        case 'suspend':
        case 'activate':
        case 'reset-password':
        case 'delete':
          showFeedback(USER_ACTION_FEEDBACK[actionId]?.(user.fullName) ?? 'Action completed (preview mode)');
          break;
        default:
          break;
      }
    },
    [openUserView, openUserEdit, showFeedback],
  );

  const handleRoleAction = useCallback(
    (actionId, role) => {
      switch (actionId) {
        case 'view':
          setMatrixRoleId(role.id);
          setActiveSection('permissions');
          showFeedback(ROLE_ACTION_FEEDBACK.view(role.name));
          break;
        case 'edit':
          openRoleEdit(role.id);
          break;
        case 'duplicate':
        case 'disable':
        case 'delete':
          showFeedback(ROLE_ACTION_FEEDBACK[actionId]?.(role.name) ?? 'Action completed (preview mode)');
          break;
        default:
          break;
      }
    },
    [openRoleEdit, showFeedback],
  );

  const handleBulkAction = useCallback(
    (actionId) => {
      const count = selectedUserIds.size;
      const message = BULK_FEEDBACK[actionId]?.(count);
      if (message) {
        showFeedback(message);
        clearUserSelection();
      }
    },
    [selectedUserIds.size, showFeedback, clearUserSelection],
  );

  const saveInvite = useCallback(() => {
    closeInvite();
    showFeedback('User invitation sent (preview mode)', 'info');
  }, [closeInvite, showFeedback]);

  const saveUserEdit = useCallback(() => {
    closeUserEdit();
    showFeedback('User updated (preview mode)', 'info');
  }, [closeUserEdit, showFeedback]);

  const saveRoleEdit = useCallback(() => {
    const wasCreate = roleModalMode === 'create';
    closeRoleModal();
    showFeedback(
      wasCreate ? ROLE_ACTION_FEEDBACK.create() : 'Role updated (preview mode)',
      'info',
    );
  }, [closeRoleModal, roleModalMode, showFeedback]);

  const saveDraft = useCallback(() => {
    showFeedback('Users & Roles draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const simulateRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 420);
  }, []);

  const isAllUsersSelected =
    filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const isSomeUsersSelected =
    selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length;

  return {
    activeSection,
    setActiveSection,
    isLoading,
    statistics,
    users: filteredUsers,
    roles: displayRoles,
    allRoles: data.roles,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    selectedUserIds,
    toggleUserSelect,
    toggleSelectAllUsers,
    clearUserSelection,
    isAllUsersSelected,
    isSomeUsersSelected,
    viewingUser,
    closeUserView,
    editingUser,
    closeUserEdit,
    inviteModalOpen,
    openInvite,
    closeInvite,
    roleModalMode,
    roleModalOpen: Boolean(roleModalMode),
    editingRole,
    openRoleEdit,
    openRoleCreate,
    closeRoleModal,
    matrixRoleId,
    setMatrixRoleId,
    matrixRole,
    handleUserAction,
    handleRoleAction,
    handleBulkAction,
    saveInvite,
    saveUserEdit,
    saveRoleEdit,
    saveDraft,
    simulateRefresh,
    showEmptyUsers,
    setShowEmptyUsers,
    showEmptyRoles,
    setShowEmptyRoles,
    feedback,
    closeFeedback,
  };
}
