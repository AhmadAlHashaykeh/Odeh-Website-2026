import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import { recentActivity } from '../mock/dashboardData';
import styles from './RecentActivity.module.css';

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RecentActivity() {
  const headingRef = useScrollReveal(0.1);

  return (
    <section className={styles.section} aria-labelledby="recent-activity-heading">
      <div ref={headingRef} className={`${styles.heading} reveal`}>
        <h2 id="recent-activity-heading" className={styles.title}>Recent Activity</h2>
        <p className={styles.subtitle}>Latest changes across your CMS</p>
      </div>

      <div className={styles.timeline}>
        {recentActivity.map((entry, index) => (
          <ActivityEntry key={entry.id} entry={entry} index={index} isLast={index === recentActivity.length - 1} />
        ))}
      </div>
    </section>
  );
}

function ActivityEntry({ entry, index, isLast }) {
  const revealRef = useScrollReveal(0.05);

  return (
    <article
      ref={revealRef}
      className={`${styles.entry} reveal`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div className={styles.marker}>
        <div className={styles.iconWrap}>
          <AdminIcon name={entry.icon} size={16} />
        </div>
        {!isLast && <div className={styles.line} aria-hidden="true" />}
      </div>

      <div className={styles.content}>
        <div className={styles.entryHeader}>
          <h3 className={styles.entryTitle}>{entry.title}</h3>
          <time className={styles.timestamp} dateTime={entry.timestamp}>
            {formatTimestamp(entry.timestamp)}
          </time>
        </div>
        <p className={styles.entryDetail}>{entry.detail}</p>
      </div>
    </article>
  );
}
