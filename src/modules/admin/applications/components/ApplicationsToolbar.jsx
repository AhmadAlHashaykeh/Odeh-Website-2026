import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './ApplicationsToolbar.module.css';

export default function ApplicationsToolbar({
  searchValue,
  onSearchChange,
  jobFilter,
  onJobFilterChange,
  jobOptions,
  departmentFilter,
  onDepartmentFilterChange,
  departmentOptions,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  experienceFilter,
  onExperienceFilterChange,
  experienceOptions,
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
            placeholder="Search by candidate name, email, job, or cover letter..."
            ariaLabel="Search applications"
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
          label="Job"
          value={jobFilter}
          onChange={onJobFilterChange}
          options={jobOptions}
          icon="careers"
          ariaLabel="Filter by job"
        />
        <FilterDropdown
          label="Department"
          value={departmentFilter}
          onChange={onDepartmentFilterChange}
          options={departmentOptions}
          icon="filter"
          ariaLabel="Filter by department"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          icon="filter"
          ariaLabel="Filter by application status"
        />
        <FilterDropdown
          label="Experience"
          value={experienceFilter}
          onChange={onExperienceFilterChange}
          options={experienceOptions}
          icon="team"
          ariaLabel="Filter by years of experience"
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
          ariaLabel="Sort applications"
        />
      </div>
    </div>
  );
}
