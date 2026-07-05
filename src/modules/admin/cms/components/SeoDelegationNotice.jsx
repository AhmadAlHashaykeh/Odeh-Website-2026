import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './SeoDelegationNotice.module.css';

function resolveStatusLabel(seoStatus) {
  if (seoStatus === 'complete') return 'Complete';
  if (seoStatus === 'pending') return 'Pending';
  return seoStatus || 'Unknown';
}

export default function SeoDelegationNotice({
  seoStatus = 'pending',
  seoPath = '/admin/seo',
  compact = false,
  className = '',
}) {
  const statusClass = seoStatus === 'complete' ? styles.complete : styles.pending;

  return (
    <div className={`${styles.notice} ${compact ? styles.compact : ''} ${className}`.trim()}>
      <div className={styles.header}>
        <div className={styles.iconWrap} aria-hidden="true">
          <AdminIcon name="seo" size={18} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>SEO Metadata</h3>
          {!compact && (
            <p className={styles.desc}>
              Meta title and description are managed exclusively in the SEO module.
            </p>
          )}
        </div>
        <span className={`${styles.statusBadge} ${statusClass}`}>
          {resolveStatusLabel(seoStatus)}
        </span>
      </div>
      <Link to={seoPath} className={styles.manageLink}>
        <AdminIcon name="external" size={14} />
        Open SEO
      </Link>
    </div>
  );
}
