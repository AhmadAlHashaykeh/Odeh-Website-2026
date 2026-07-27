import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown } from '../../cms/components';
import styles from './TeamCategoriesToolbar.module.css';

export default function TeamCategoriesToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  sortBy,
  onSortChange,
  sortOptions,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchCol}>
        <SearchField
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search categories by name, slug, or description..."
          ariaLabel="Search team categories"
        />
      </div>

      <div className={styles.filters}>
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
        />
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh categories"
        >
          <AdminIcon name="refresh" size={16} />
          Refresh
        </button>
      </div>
    </div>
  );
}
