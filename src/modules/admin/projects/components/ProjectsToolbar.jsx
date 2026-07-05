import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './ProjectsToolbar.module.css';

export default function ProjectsToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  featuredFilter,
  onFeaturedFilterChange,
  featuredOptions,
  publishedFilter,
  onPublishedFilterChange,
  publishedOptions,
  yearFilter,
  onYearFilterChange,
  yearOptions,
  typeFilter,
  onTypeFilterChange,
  typeOptions,
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
            placeholder="Search projects by name, location, type..."
            ariaLabel="Search projects"
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
          label="Featured"
          value={featuredFilter}
          onChange={onFeaturedFilterChange}
          options={featuredOptions}
          icon="star"
          ariaLabel="Filter by featured"
        />
        <FilterDropdown
          label="Publication"
          value={publishedFilter}
          onChange={onPublishedFilterChange}
          options={publishedOptions}
          icon="external"
          ariaLabel="Filter by publication"
        />
        <FilterDropdown
          label="Year"
          value={yearFilter}
          onChange={onYearFilterChange}
          options={yearOptions}
          icon="filter"
          ariaLabel="Filter by year"
        />
        <FilterDropdown
          label="Type"
          value={typeFilter}
          onChange={onTypeFilterChange}
          options={typeOptions}
          icon="projects"
          ariaLabel="Filter by project type"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort projects"
        />
      </div>
    </div>
  );
}
