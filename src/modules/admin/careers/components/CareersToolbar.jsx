import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './CareersToolbar.module.css';

export default function CareersToolbar({
  searchValue,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  departmentOptions,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  employmentTypeFilter,
  onEmploymentTypeFilterChange,
  employmentTypeOptions,
  workModeFilter,
  onWorkModeFilterChange,
  workModeOptions,
  experienceFilter,
  onExperienceFilterChange,
  experienceOptions,
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
            placeholder="Search jobs by title, department, location, or description..."
            ariaLabel="Search jobs"
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
          ariaLabel="Filter by job status"
        />
        <FilterDropdown
          label="Type"
          value={employmentTypeFilter}
          onChange={onEmploymentTypeFilterChange}
          options={employmentTypeOptions}
          icon="careers"
          ariaLabel="Filter by employment type"
        />
        <FilterDropdown
          label="Work Mode"
          value={workModeFilter}
          onChange={onWorkModeFilterChange}
          options={workModeOptions}
          icon="connect"
          ariaLabel="Filter by work mode"
        />
        <FilterDropdown
          label="Experience"
          value={experienceFilter}
          onChange={onExperienceFilterChange}
          options={experienceOptions}
          icon="team"
          ariaLabel="Filter by experience level"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort jobs"
        />
      </div>
    </div>
  );
}
