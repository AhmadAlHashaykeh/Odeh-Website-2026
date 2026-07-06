import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './ActivitiesOverviewCard.module.css';

export default function ActivitiesOverviewCard({ stats }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Activities</h2>
          <p className={styles.desc}>
            Activity records are managed in the Activities module. This section shows a quick overview only.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Activities</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.published}</span>
            <span className={styles.statLabel}>Published</span>
          </div>
        </div>
      </div>

      <div className={styles.preview}>
        <span className={styles.previewLabel}>Activity Preview</span>
        <div className={styles.activityGrid}>
          {stats.preview.map((activity) => (
            <div key={activity.id} className={styles.activityCard}>
              <img src={resolveMediaUrl(activity.coverImage)} alt={activity.title} loading="lazy" />
              <div className={styles.activityInfo}>
                <strong>{activity.title}</strong>
                <span>{activity.activityDate}</span>
                <span className={styles.location}>{activity.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/admin/activities" className={styles.manageLink}>
        <AdminIcon name="activities" size={14} />
        Manage Activities
      </Link>
    </article>
  );
}
