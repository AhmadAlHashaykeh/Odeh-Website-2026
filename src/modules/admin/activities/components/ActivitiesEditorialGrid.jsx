import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ActivityQuickActions from './ActivityQuickActions';
import styles from './ActivitiesEditorialGrid.module.css';

export default function ActivitiesEditorialGrid({
  items,
  selectedIds,
  onToggleSelect,
  onActivityClick,
  onViewActivity,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((activity) => (
        <article
          key={activity.id}
          className={[
            styles.card,
            activity.featured ? styles.featured : '',
            selectedIds.has(activity.id) ? styles.selected : '',
          ].filter(Boolean).join(' ')}
        >
          <div className={styles.imageWrap}>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => onActivityClick(activity.id)}
              aria-label={`View ${activity.title}`}
            >
              <img src={resolveMediaUrl(activity.coverImage)}
                alt={activity.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.imageOverlay} aria-hidden="true" />
            </button>

            <div className={styles.cardTop}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(activity.id)}
                onChange={() => onToggleSelect(activity.id)}
                aria-label={`Select ${activity.title}`}
              />
              <ActivityQuickActions activity={activity} onView={onViewActivity} onAction={onAction} />
            </div>

            <div className={styles.imageMeta}>
              <span className={styles.date}>
                <AdminIcon name="calendar" size={12} />
                {activity.activityDate}
              </span>
              <span className={styles.galleryCount}>
                <AdminIcon name="images" size={12} />
                {activity.galleryCount}
              </span>
            </div>

            {activity.featured && (
              <span className={styles.featuredRibbon}>
                <AdminIcon name="star" size={12} />
                Featured
              </span>
            )}
          </div>

          <div className={styles.body}>
            <div className={styles.badgeRow}>
              <StatusBadge status={activity.status} />
              {activity.published && (
                <span className={styles.publishedBadge}>Live</span>
              )}
            </div>

            <button
              type="button"
              className={styles.titleBtn}
              onClick={() => onActivityClick(activity.id)}
            >
              <h3 className={styles.title}>{activity.title}</h3>
            </button>

            <p className={styles.location}>
              <AdminIcon name="location" size={13} />
              {activity.location}
            </p>

            <p className={styles.preview}>{activity.descriptionPreview}</p>

            <div className={styles.footer}>
              <span className={styles.order}>Order #{activity.displayOrder}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
