import AdminIcon from '../../components/AdminIcons';
import { Select } from '../../ui';
import styles from './Pagination.module.css';

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(sorted[i]);
  }

  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = PER_PAGE_OPTIONS,
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong> items
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <AdminIcon name="chevronLeft" size={16} />
          <span className={styles.navLabel}>Previous</span>
        </button>

        <div className={styles.pages} role="navigation" aria-label="Pagination">
          {pageNumbers.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <span className={styles.navLabel}>Next</span>
          <AdminIcon name="chevronRight" size={16} />
        </button>
      </div>

      <div className={styles.perPage}>
        <label htmlFor="per-page-select" className={styles.perPageLabel}>
          Per page
        </label>
        <Select
          id="per-page-select"
          size="sm"
          value={String(perPage)}
          onChange={(nextValue) => onPerPageChange(Number(nextValue))}
          options={perPageOptions.map((option) => ({
            value: String(option),
            label: String(option),
          }))}
          ariaLabel="Per page"
          className={styles.perPageSelect}
        />
      </div>
    </div>
  );
}
