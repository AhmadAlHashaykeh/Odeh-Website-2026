import AdminIcon from '../../components/AdminIcons';
import StatusBadge from './StatusBadge';
import styles from './CardView.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CardView({
  items = [],
  selectedIds,
  onToggleSelect,
  renderCard,
}) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article
          key={item.id}
          className={`${styles.card} ${selectedIds.has(item.id) ? styles.selected : ''}`}
        >
          <div className={styles.cardTop}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedIds.has(item.id)}
              onChange={() => onToggleSelect(item.id)}
              aria-label={`Select ${item.title || item.id}`}
            />
            <button type="button" className={styles.moreBtn} aria-label="More actions">
              <AdminIcon name="more" size={16} />
            </button>
          </div>

          {renderCard ? (
            renderCard(item)
          ) : (
            <>
              <h3 className={styles.title}>{item.title}</h3>
              {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
              <div className={styles.meta}>
                {item.category && (
                  <span className={styles.category}>{item.category}</span>
                )}
                {item.status && <StatusBadge status={item.status} />}
              </div>
              {item.updatedAt && (
                <span className={styles.date}>Updated {formatDate(item.updatedAt)}</span>
              )}
            </>
          )}
        </article>
      ))}
    </div>
  );
}
