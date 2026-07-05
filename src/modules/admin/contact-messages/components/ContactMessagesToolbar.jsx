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
  inquiryTypeFilter,
  onInquiryTypeFilterChange,
  inquiryTypeOptions,
  assignedToFilter,
  onAssignedToFilterChange,
  assignedToOptions,
  submittedDateFilter,
  onSubmittedDateFilterChange,
  submittedDateOptions,
  sortBy,
  onSortChange,
  sortOptions,
  viewMode,
  onViewChange,
  onRefresh,
  isRefreshing,
  onBulkActionsClick,
  bulkActionsDisabled,
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
          <button
            type="button"
            className={styles.bulkBtn}
            onClick={onBulkActionsClick}
            disabled={bulkActionsDisabled}
          >
            Bulk Actions
            <AdminIcon name="chevronDown" size={14} />
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
          label="Inquiry Type"
          value={inquiryTypeFilter}
          onChange={onInquiryTypeFilterChange}
          options={inquiryTypeOptions}
          icon="messages"
          ariaLabel="Filter by inquiry type"
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
          label="Submitted"
          value={submittedDateFilter}
          onChange={onSubmittedDateFilterChange}
          options={submittedDateOptions}
          icon="sort"
          ariaLabel="Filter by submitted date"
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
