import { useCallback, useEffect, useMemo, useState } from 'react';
import * as usersApi from '../../../../api/users';
import * as rolesApi from '../../../../api/roles';
import * as rolePermissionsApi from '../../../../api/rolePermissions';
import { ApiError } from '../../../../api/client';
import { mapApiErrorsToForm } from '../../cms/action-flows/formErrors';
import { extractFormValues } from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import {
  computeUsersRolesStatistics,
  NEW_ROLE_TEMPLATE,
  PERMISSION_MODULES,
} from '../mock/usersRolesConfig';

const UI_ACTIONS = ['view', 'create', 'edit', 'delete'];

function getUserInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '?';

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function roleDisplayName(role) {
  if (!role) return '—';
  if (typeof role === 'string') return role;
  if (typeof role === 'object' && role.name) return role.name;
  return '—';
}

/** Map API user payload to the shape the Users & Roles UI expects. */
function normalizeUser(user) {
  return {
    ...user,
    role: roleDisplayName(user.role),
    initials: user.initials || getUserInitials(user.fullName),
    lastLogin: user.lastLoginAt ?? user.lastLogin ?? null,
    createdDate: user.createdAt ?? user.createdDate ?? null,
    loginActivity: Array.isArray(user.loginActivity) ? user.loginActivity : [],
  };
}

function permissionState(granted) {
  return granted ? 'granted' : 'denied';
}

function mapPermissionsToMatrix(apiPermissions = []) {
  const matrix = Object.fromEntries(
    PERMISSION_MODULES.map((mod) => [
      mod.id,
      Object.fromEntries(UI_ACTIONS.map((action) => [action, 'denied'])),
    ]),
  );

  apiPermissions.forEach((entry) => {
    matrix[entry.module] = {
      view: permissionState(entry.canView),
      create: permissionState(entry.canCreate),
      edit: permissionState(entry.canUpdate),
      delete: permissionState(entry.canDelete),
      publish: 'denied',
      manage: 'denied',
    };
  });

  return matrix;
}

function countGrantedPermissions(matrix) {
  return Object.values(matrix).reduce(
    (sum, perms) => sum + UI_ACTIONS.filter((action) => perms[action] === 'granted').length,
    0,
  );
}

function matrixToApiPayload(matrix) {
  return PERMISSION_MODULES.map((mod) => {
    const perms = matrix[mod.id] ?? {};
    return {
      module: mod.id,
      canView: perms.view === 'granted',
      canCreate: perms.create === 'granted',
      canUpdate: perms.edit === 'granted',
      canDelete: perms.delete === 'granted',
    };
  });
}

export function useUsersRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissionsByRole, setPermissionsByRole] = useState({});
  const [activeSection, setActiveSection] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const [viewingUserId, setViewingUserId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [matrixRoleId, setMatrixRoleId] = useState(null);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        usersApi.list({ per_page: 100 }),
        rolesApi.list({ per_page: 50 }),
      ]);

      setUsers((usersResponse.data ?? []).map(normalizeUser));
      setRoles(rolesResponse.data);

      if (!matrixRoleId && rolesResponse.data.length > 0) {
        setMatrixRoleId(rolesResponse.data[0].id);
      }
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Failed to load users and roles.');
    } finally {
      setIsLoading(false);
    }
  }, [matrixRoleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!matrixRoleId) return undefined;

    let cancelled = false;

    rolePermissionsApi
      .list(matrixRoleId)
      .then((permissions) => {
        if (!cancelled) {
          setPermissionsByRole((prev) => ({
            ...prev,
            [matrixRoleId]: mapPermissionsToMatrix(permissions),
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPermissionsByRole((prev) => ({
            ...prev,
            [matrixRoleId]: mapPermissionsToMatrix([]),
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [matrixRoleId]);

  const rolesWithPermissions = useMemo(
    () =>
      roles.map((role) => {
        const permissions = permissionsByRole[role.id] ?? mapPermissionsToMatrix([]);
        return {
          ...role,
          accessLevel: role.slug === 'super-admin' ? 'Full' : 'Standard',
          permissions,
          permissionCount: countGrantedPermissions(permissions),
        };
      }),
    [roles, permissionsByRole],
  );

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.department ?? '').toLowerCase().includes(query),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.roleId === roleFilter);
    }

    switch (sortBy) {
      case 'name_desc':
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'recent_login':
        result.sort((a, b) => {
          if (!a.lastLoginAt) return 1;
          if (!b.lastLoginAt) return -1;
          return new Date(b.lastLoginAt) - new Date(a.lastLoginAt);
        });
        break;
      case 'created_desc':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    return result;
  }, [users, searchQuery, statusFilter, roleFilter, sortBy]);

  const statistics = useMemo(
    () => computeUsersRolesStatistics(users, roles),
    [users, roles],
  );

  const viewingUser = useMemo(
    () => users.find((user) => user.id === viewingUserId) ?? null,
    [users, viewingUserId],
  );

  const editingUser = useMemo(
    () => users.find((user) => user.id === editingUserId) ?? null,
    [users, editingUserId],
  );

  const editingRole = useMemo(() => {
    if (roleModalMode === 'create') return NEW_ROLE_TEMPLATE;
    return rolesWithPermissions.find((role) => role.id === editingRoleId) ?? null;
  }, [roleModalMode, rolesWithPermissions, editingRoleId]);

  const matrixRole = useMemo(
    () => rolesWithPermissions.find((role) => role.id === matrixRoleId) ?? null,
    [rolesWithPermissions, matrixRoleId],
  );

  const securityOverview = useMemo(() => {
    const activeUsers = users.filter((user) => user.status === 'active').length;
    const invitedUsers = users.filter((user) => user.status === 'invited').length;
    const suspendedUsers = users.filter((user) => user.status === 'suspended').length;
    const twoFaEnabled = users.filter((user) => user.twoFactorEnabled).length;
    const lastLoginUser = [...users]
      .filter((user) => user.lastLoginAt)
      .sort((a, b) => new Date(b.lastLoginAt) - new Date(a.lastLoginAt))[0];

    return {
      activeUsers,
      invitedUsers,
      suspendedUsers,
      twoFaEnabled,
      twoFaTotal: users.length,
      lastAdminActivity: lastLoginUser
        ? { name: lastLoginUser.fullName, date: lastLoginUser.lastLoginAt }
        : null,
      roleCoverage: {
        assigned: roles.filter((role) => (role.userCount ?? 0) > 0).length,
        total: roles.length,
      },
    };
  }, [users, roles]);

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
      return new Set(filteredUsers.map((user) => user.id));
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
    async (actionId, user) => {
      switch (actionId) {
        case 'view':
          openUserView(user.id);
          break;
        case 'edit':
          openUserEdit(user.id);
          break;
        case 'suspend':
        case 'activate': {
          const status = actionId === 'suspend' ? 'suspended' : 'active';
          try {
            await usersApi.update(user.id, { status });
            await loadData();
            showFeedback(`${user.fullName} ${status === 'active' ? 'activated' : 'suspended'}.`, 'success');
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Failed to update user.',
              'error',
            );
          }
          break;
        }
        case 'delete': {
          try {
            await usersApi.destroy(user.id);
            await loadData();
            showFeedback(`${user.fullName} removed.`, 'success');
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Failed to delete user.',
              'error',
            );
          }
          break;
        }
        default:
          showFeedback('This action is not available.', 'info');
          break;
      }
    },
    [openUserView, openUserEdit, loadData, showFeedback],
  );

  const handleRoleAction = useCallback(
    async (actionId, role) => {
      switch (actionId) {
        case 'view':
          setMatrixRoleId(role.id);
          setActiveSection('permissions');
          break;
        case 'edit':
          openRoleEdit(role.id);
          break;
        case 'disable': {
          try {
            await rolesApi.update(role.id, {
              status: role.status === 'active' ? 'disabled' : 'active',
            });
            await loadData();
            showFeedback(`Role "${role.name}" updated.`, 'success');
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Failed to update role.',
              'error',
            );
          }
          break;
        }
        case 'delete': {
          try {
            await rolesApi.destroy(role.id);
            await loadData();
            showFeedback(`Role "${role.name}" deleted.`, 'success');
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Failed to delete role.',
              'error',
            );
          }
          break;
        }
        default:
          showFeedback('This action is not available.', 'info');
          break;
      }
    },
    [openRoleEdit, loadData, showFeedback],
  );

  const saveInvite = useCallback(
    async (formElement) => {
      const values = extractFormValues(formElement);
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        roleId: values.roleId,
        department: values.department,
        accessScope: values.accessScope,
        status: 'active',
      };

      try {
        await usersApi.create(payload);
        closeInvite();
        await loadData();
        showFeedback('Admin account created.', 'success');
      } catch (error) {
        const mapped = error instanceof ApiError ? mapApiErrorsToForm(error.errors) : {};
        const message =
          Object.values(mapped).flat()[0] ??
          (error instanceof ApiError ? error.message : 'Failed to create admin.');
        showFeedback(message, 'error');
      }
    },
    [closeInvite, loadData, showFeedback],
  );

  const saveUserEdit = useCallback(
    async (formElement) => {
      if (!editingUserId) return;

      const values = extractFormValues(formElement);
      const payload = {
        fullName: values.fullName,
        email: values.email,
        roleId: values.roleId,
        department: values.department,
        status: values.status,
        accessScope: values.accessScope,
        twoFactorEnabled: values.twoFactor === 'enabled',
      };

      try {
        await usersApi.update(editingUserId, payload);
        closeUserEdit();
        await loadData();
        showFeedback('User updated.', 'success');
      } catch (error) {
        const mapped = error instanceof ApiError ? mapApiErrorsToForm(error.errors) : {};
        const message =
          Object.values(mapped).flat()[0] ??
          (error instanceof ApiError ? error.message : 'Failed to update user.');
        showFeedback(message, 'error');
      }
    },
    [editingUserId, closeUserEdit, loadData, showFeedback],
  );

  const saveRoleEdit = useCallback(
    async (formElement) => {
      const values = extractFormValues(formElement);
      const payload = {
        name: values.name,
        description: values.description,
        status: values.status,
      };

      try {
        if (roleModalMode === 'create') {
          await rolesApi.create(payload);
        } else if (editingRoleId) {
          await rolesApi.update(editingRoleId, payload);
        }

        closeRoleModal();
        await loadData();
        showFeedback(
          roleModalMode === 'create' ? 'Role created.' : 'Role updated.',
          'success',
        );
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to save role.',
          'error',
        );
      }
    },
    [roleModalMode, editingRoleId, closeRoleModal, loadData, showFeedback],
  );

  const savePermissions = useCallback(
    async (matrix) => {
      if (!matrixRoleId) return;

      setIsSavingPermissions(true);

      try {
        await rolePermissionsApi.update(matrixRoleId, matrixToApiPayload(matrix));
        await loadData();
        showFeedback('Permissions saved.', 'success');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to save permissions.',
          'error',
        );
      } finally {
        setIsSavingPermissions(false);
      }
    },
    [matrixRoleId, loadData, showFeedback],
  );

  const saveDraft = useCallback(() => {
    showFeedback('All changes are saved immediately.', 'info');
  }, [showFeedback]);

  const simulateRefresh = useCallback(() => loadData(), [loadData]);

  const isAllUsersSelected =
    filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const isSomeUsersSelected =
    selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length;

  return {
    activeSection,
    setActiveSection,
    isLoading,
    loadError,
    statistics,
    users: filteredUsers,
    roles: rolesWithPermissions,
    allRoles: rolesWithPermissions,
    roleOptions: rolesWithPermissions.map((role) => ({ value: role.id, label: role.name })),
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
    securityOverview,
    handleUserAction,
    handleRoleAction,
    saveInvite,
    saveUserEdit,
    saveRoleEdit,
    savePermissions,
    isSavingPermissions,
    saveDraft,
    simulateRefresh,
    feedback,
    closeFeedback,
  };
}
