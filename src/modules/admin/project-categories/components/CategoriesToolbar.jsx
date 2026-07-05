import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './CategoriesToolbar.module.css';

export default function CategoriesToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  seoFilter,
  onSeoFilterChange,
  seoOptions,
  projectCountFilter,
  onProjectCountFilterChange,
  projectCountOptions,
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
            placeholder="Search categories by name, slug, or description..."
            ariaLabel="Search categories"
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
          label="SEO"
          value={seoFilter}
          onChange={onSeoFilterChange}
          options={seoOptions}
          icon="seo"
          ariaLabel="Filter by SEO status"
        />
        <FilterDropdown
          label="Projects"
          value={projectCountFilter}
          onChange={onProjectCountFilterChange}
          options={projectCountOptions}
          icon="projects"
          ariaLabel="Filter by project count"
        />
        <FilterDropdown
          label="Sort"
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          icon="sort"
          ariaLabel="Sort categories"
        />
      </div>
    </div>
  );
}
