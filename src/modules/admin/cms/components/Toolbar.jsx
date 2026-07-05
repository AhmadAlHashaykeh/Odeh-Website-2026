import AdminIcon from '../../components/AdminIcons';
import SearchField from './SearchField';
import FilterDropdown from './FilterDropdown';
import ViewSwitcher from './ViewSwitcher';
import styles from './Toolbar.module.css';

export default function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search items...',
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions = [],
  sortBy,
  onSortChange,
  sortOptions = [],
  viewMode,
  onViewChange,
  onRefresh,
  isRefreshing = false,
  onBulkActionsClick,
  bulkActionsDisabled = true,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchCol}>
        <SearchField
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          ariaLabel="Search items"
        />
      </div>

      <div className={styles.filters}>
        {statusOptions.length > 0 && (
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
            icon="filter"
            ariaLabel="Filter by status"
          />
        )}

        {categoryOptions.length > 0 && (
          <FilterDropdown
            label="Category"
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            options={categoryOptions}
            icon="categories"
            ariaLabel="Filter by category"
          />
        )}

        {sortOptions.length > 0 && (
          <FilterDropdown
            label="Sort"
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            icon="sort"
            ariaLabel="Sort items"
          />
        )}
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
  );
}
