import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './ContactMessagesToolbar.module.css';

export default function ContactMessagesToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  priorityFilter,
  onPriorityFilterChange,
  priorityOptions,
  assignedToFilter,
  onAssignedToFilterChange,
  assignedToOptions,
  sortBy,
  onSortChange,
  sortOptions,
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
            placeholder="Search by sender, email, subject, or message..."
            ariaLabel="Search contact messages"
          />
        </div>

        <div className={styles.actions}>
          <ViewSwitcher view={viewMode} onChange={onViewChange} />
          <button
            type="button"
            className={`${styles.iconBtn} ${isRefreshing ? styles.spinning : ''}`}
            onClick={onRefresh}
            aria-label="Refresh"
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
          options={statusOptions}
          icon="filter"
          ariaLabel="Filter by status"
        />
        <FilterDropdown
          label="Priority"
          value={priorityFilter}
          onChange={onPriorityFilterChange}
          options={priorityOptions}
          icon="star"
          ariaLabel="Filter by priority"
        />
        <FilterDropdown
          label="Assigned To"
          value={assignedToFilter}
          onChange={onAssignedToFilterChange}
          options={assignedToOptions}
          icon="team"
          ariaLabel="Filter by assignee"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort messages"
        />
      </div>
    </div>
  );
}
