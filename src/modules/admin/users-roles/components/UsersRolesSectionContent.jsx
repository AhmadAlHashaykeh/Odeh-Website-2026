import UsersSection from './UsersSection';
import RolesSection from './RolesSection';
import PermissionsMatrix from './PermissionsMatrix';
import styles from './UsersRolesSectionContent.module.css';

export default function UsersRolesSectionContent({
  activeSection,
  users,
  roles,
  allRoles,
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
  onUserClick,
  onViewUser,
  onUserAction,
  onRoleAction,
  onRoleEdit,
  onAddRole,
  onBulkAction,
  simulateRefresh,
  isLoading,
  matrixRole,
  matrixRoleId,
  setMatrixRoleId,
  roleOptions = [],
  canEdit = false,
  onSavePermissions,
  isSavingPermissions = false,
}) {
  return (
    <div className={styles.content}>
      {activeSection === 'users' && (
        <UsersSection
          users={users}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedUserIds={selectedUserIds}
          toggleUserSelect={toggleUserSelect}
          toggleSelectAllUsers={toggleSelectAllUsers}
          clearUserSelection={clearUserSelection}
          isAllUsersSelected={isAllUsersSelected}
          isSomeUsersSelected={isSomeUsersSelected}
          onUserClick={onUserClick}
          onViewUser={onViewUser}
          onUserAction={onUserAction}
          onBulkAction={onBulkAction}
          simulateRefresh={simulateRefresh}
          isLoading={isLoading}
        />
      )}

      {activeSection === 'roles' && (
        <RolesSection
          roles={roles}
          onRoleAction={onRoleAction}
          onRoleEdit={onRoleEdit}
          onAddRole={onAddRole}
        />
      )}

      {activeSection === 'permissions' && (
        <PermissionsMatrix
          role={matrixRole}
          matrixRoleId={matrixRoleId}
          onRoleChange={setMatrixRoleId}
          roleOptions={roleOptions}
          canEdit={canEdit}
          onSave={onSavePermissions}
          isSaving={isSavingPermissions}
        />
      )}
    </div>
  );
}
