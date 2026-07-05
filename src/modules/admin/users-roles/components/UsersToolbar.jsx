import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import {
  userStatusOptions,
  userRoleFilterOptions,
  userSortOptions,
} from '../mock/usersRolesConfig';
import styles from './UsersToolbar.module.css';

export default function UsersToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <div className={styles.searchCol}>
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search users by name, email, or department..."
            ariaLabel="Search admin users"
          />
        </div>

        <div className={styles.actions}>
          <ViewSwitcher view={viewMode} onChange={onViewChange} />
          <button
            type="button"
            className={`${styles.iconBtn} ${isRefreshing ? styles.spinning : ''}`}
            onClick={onRefresh}
            aria-label="Refresh users"
            disabled={isRefreshing}
          >
            <AdminIcon name="refresh" size={16} />
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={userStatusOptions}
          icon="filter"
          ariaLabel="Filter by status"
        />
        <FilterDropdown
          label="Role"
          value={roleFilter}
          onChange={onRoleFilterChange}
          options={userRoleFilterOptions}
          icon="users"
          ariaLabel="Filter by role"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={userSortOptions}
          icon="sort"
          ariaLabel="Sort users"
        />
      </div>
    </div>
  );
}
