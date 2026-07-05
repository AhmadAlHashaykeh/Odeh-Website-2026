import { memo } from 'react';
import { getScoreTone } from '../utils/seoAudit';
import AdminIcon from '../../components/AdminIcons';
import styles from './SeoPageCard.module.css';

function SeoPageCard({ page, isActive, onSelect }) {
  const scoreTone = getScoreTone(page.seoScore);

  return (
    <button
      type="button"
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={() => onSelect(page.id)}
      aria-pressed={isActive}
    >
      <div className={styles.row}>
        <div className={styles.titleBlock}>
          <span className={styles.name}>{page.name}</span>
          <code className={styles.route}>{page.route}</code>
        </div>

        <div className={styles.trailing}>
          {page.hasWarnings && (
            <span className={styles.warningBadge} title="Incomplete SEO">
              <AdminIcon name="warning" size={13} />
            </span>
          )}
          <span className={`${styles.scoreBadge} ${styles[scoreTone]}`}>{page.seoScore}%</span>
        </div>
      </div>
    </button>
  );
}

export default memo(SeoPageCard);
