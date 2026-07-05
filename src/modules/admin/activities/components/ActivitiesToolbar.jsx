import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './ActivitiesToolbar.module.css';

export default function ActivitiesToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  featuredFilter,
  onFeaturedFilterChange,
  featuredOptions,
  yearFilter,
  onYearFilterChange,
  yearOptions,
  gallerySizeFilter,
  onGallerySizeFilterChange,
  gallerySizeOptions,
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
            placeholder="Search activities by title, location, date..."
            ariaLabel="Search activities"
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
          label="Featured"
          value={featuredFilter}
          onChange={onFeaturedFilterChange}
          options={featuredOptions}
          icon="star"
          ariaLabel="Filter by featured"
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
          label="Gallery Size"
          value={gallerySizeFilter}
          onChange={onGallerySizeFilterChange}
          options={gallerySizeOptions}
          icon="images"
          ariaLabel="Filter by gallery size"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort activities"
        />
      </div>
    </div>
  );
}
