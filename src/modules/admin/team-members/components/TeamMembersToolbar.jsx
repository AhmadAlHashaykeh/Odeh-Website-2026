import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './TeamMembersToolbar.module.css';

export default function TeamMembersToolbar({
  searchValue,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  departmentOptions,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
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
            placeholder="Search members by name, position, department..."
            ariaLabel="Search team members"
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
          icon="team"
          ariaLabel="Filter by department"
        />
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          onChange={onCategoryFilterChange}
          options={categoryOptions}
          icon="categories"
          ariaLabel="Filter by category"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          icon="filter"
          ariaLabel="Filter by status"
        />
        <FilterDropdown
          label="Experience"
          value={experienceFilter}
          onChange={onExperienceFilterChange}
          options={experienceOptions}
          icon="filter"
          ariaLabel="Filter by experience"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort team members"
        />
      </div>
    </div>
  );
}
