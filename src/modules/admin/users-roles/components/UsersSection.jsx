import { useState } from 'react';
import { SelectionToolbar } from '../../cms/components';
import { userBulkActionOptions } from '../mock/usersRolesConfig';
import UsersToolbar from './UsersToolbar';
import UsersTableView from './UsersTableView';
import UsersCardView from './UsersCardView';
import UsersEmptyState from './UsersEmptyState';
import styles from './UsersSection.module.css';

export default function UsersSection({
  users,
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
  onBulkAction,
  simulateRefresh,
  isLoading,
}) {
  const [bulkAction, setBulkAction] = useState(userBulkActionOptions[0]?.value || 'activate');

  const handleBulkApply = () => {
    onBulkAction(bulkAction);
  };

  const showTable = viewMode === 'table';
  const showCards = viewMode === 'card';

  if (users.length === 0) {
    return (
      <div className={styles.section}>
        <UsersToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onRefresh={simulateRefresh}
          isRefreshing={isLoading}
        />
        <UsersEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <UsersToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onRefresh={simulateRefresh}
        isRefreshing={isLoading}
      />

      <SelectionToolbar
        selectedCount={selectedUserIds.size}
        onClearSelection={clearUserSelection}
        bulkActionOptions={userBulkActionOptions}
        bulkAction={bulkAction}
        onBulkActionChange={setBulkAction}
        onBulkApply={handleBulkApply}
        onDelete={() => onBulkAction('delete')}
      />

      {showTable && (
        <div className={styles.tableWrap}>
          <UsersTableView
            users={users}
            selectedIds={selectedUserIds}
            onToggleSelect={toggleUserSelect}
            onToggleSelectAll={toggleSelectAllUsers}
            isAllSelected={isAllUsersSelected}
            isSomeSelected={isSomeUsersSelected}
            onUserClick={onUserClick}
            onViewUser={onViewUser}
            onAction={onUserAction}
          />
        </div>
      )}

      <div className={showCards ? styles.cardWrap : styles.mobileCards}>
        <UsersCardView
          users={users}
          selectedIds={selectedUserIds}
          onToggleSelect={toggleUserSelect}
          onUserClick={onUserClick}
          onViewUser={onViewUser}
          onAction={onUserAction}
        />
      </div>
    </div>
  );
}
