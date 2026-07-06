import { Link } from 'react-router-dom';
import { getSearchBadgeType, getSearchExcerpt } from '../../utils/contentMappers';
import styles from './SearchResultCard.module.css';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function SearchResultCard({ item, style }) {
  const badge = getSearchBadgeType(item.type);
  const excerpt = getSearchExcerpt(item);

  return (
    <Link
      to={item.path}
      className={styles.card}
      style={style}
    >
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[`badge_${badge.toLowerCase()}`]}`}>
          {badge}
        </span>
        <span className={styles.view}>
          View
          <ArrowIcon />
        </span>
      </div>
      <h2 className={styles.title}>{item.title}</h2>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
    </Link>
  );
}
