import AdminIcon from '../../components/AdminIcons';
import { Input, Select } from '../../ui';
import SeoPageCard from './SeoPageCard';
import styles from './SeoPageList.module.css';

export default function SeoPageList({
  module,
  pageSections,
  selectedPageId,
  searchQuery,
  searchAllModules,
  onSearchChange,
  onSearchAllModulesChange,
  onSelect,
}) {
  const hasQuery = Boolean(searchQuery.trim());
  const flatPages = pageSections.flatMap((section) => section.pages);
  const pageCount = flatPages.length;

  return (
    <aside className={styles.listPanel} aria-label="SEO page list">
      <div className={styles.listHeader}>
        <div>
          <h2 className={styles.listTitle}>{module?.label ?? 'Pages'}</h2>
          <p className={styles.listSubtitle}>
            {hasQuery
              ? `${pageCount} result${pageCount === 1 ? '' : 's'}${searchAllModules ? ' across all modules' : ''}`
              : `${pageCount} page${pageCount === 1 ? '' : 's'} in this module`}
          </p>
        </div>
      </div>

      <div className={`${styles.searchWrap} ${hasQuery ? styles.searchWrapActive : ''}`}>
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchAllModules ? 'Search all modules…' : 'Search this module…'}
          aria-label="Search SEO pages"
          icon={<AdminIcon name="search" size={16} />}
          className={styles.searchField}
        />
        {hasQuery && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <AdminIcon name="close" size={14} />
          </button>
        )}
      </div>

      <label className={styles.searchToggle}>
        <input
          type="checkbox"
          checked={searchAllModules}
          onChange={(event) => onSearchAllModulesChange(event.target.checked)}
        />
        <span>Search all modules</span>
      </label>

      <div className={styles.mobileSelectWrap}>
        <Select
          id="seo-page-select"
          label="Select page"
          value={selectedPageId ?? ''}
          onChange={onSelect}
          options={flatPages.map((page) => ({
            value: page.id,
            label: `${page.name} (${page.route})`,
          }))}
          ariaLabel="Select SEO page"
        />
      </div>

      <div className={styles.cards} role="list">
        {pageCount === 0 ? (
          <p className={styles.empty}>No pages match your search.</p>
        ) : (
          pageSections.map((section) => (
            <div key={section.id ?? 'all'} className={styles.section}>
              {section.label && !hasQuery && (
                <h3 className={styles.sectionTitle}>
                  {section.label}
                  <span className={styles.sectionCount}>{section.pages.length}</span>
                </h3>
              )}
              <div className={styles.sectionCards}>
                {section.pages.map((page) => (
                  <SeoPageCard
                    key={page.id}
                    page={page}
                    isActive={page.id === selectedPageId}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
