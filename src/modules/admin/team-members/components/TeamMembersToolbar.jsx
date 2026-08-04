import AdminIcon from '../../components/AdminIcons';
import { SearchField, FilterDropdown, ViewSwitcher } from '../../cms/components';
import styles from './TeamMembersToolbar.module.css';

export default function TeamMembersToolbar({
  searchValue,
  onSearchChange,
  sectionFilter,
  onSectionFilterChange,
  sectionOptions,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
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
            placeholder="Search by name or job title…"
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
        </div>
      </div>

      <div className={styles.filters}>
        <FilterDropdown
          label="Section"
          value={sectionFilter}
          onChange={onSectionFilterChange}
          options={sectionOptions}
          icon="categories"
          ariaLabel="Filter by website section"
        />
        <FilterDropdown
          label="Visibility"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          icon="filter"
          ariaLabel="Filter by visibility"
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
