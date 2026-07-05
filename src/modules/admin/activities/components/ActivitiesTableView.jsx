import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ActivityQuickActions from './ActivityQuickActions';
import styles from './ActivitiesTableView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ActivitiesTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onActivityClick,
  onViewActivity,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all activities on this page"
              />
            </th>
            <th className={styles.thumbCol}>Cover</th>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Gallery</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Last Updated</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((activity) => (
            <tr
              key={activity.id}
              className={`${styles.row} ${selectedIds.has(activity.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(activity.id)}
                  onChange={() => onToggleSelect(activity.id)}
                  aria-label={`Select ${activity.title}`}
                />
              </td>
              <td className={styles.thumbCol}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => onActivityClick(activity.id)}
                  aria-label={`View ${activity.title}`}
                >
                  <img
                    src={activity.coverImage}
                    alt=""
                    className={styles.thumb}
                    loading="lazy"
                  />
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={styles.nameBtn}
                  onClick={() => onActivityClick(activity.id)}
                >
                  <span className={styles.name}>{activity.title}</span>
                  <span className={styles.slug}>/{activity.slug}</span>
                </button>
              </td>
              <td className={styles.muted}>{activity.activityDate}</td>
              <td className={styles.muted}>{activity.location}</td>
              <td>
                <span className={styles.galleryBadge}>
                  <AdminIcon name="images" size={12} />
                  {activity.galleryCount}
                </span>
              </td>
              <td><StatusBadge status={activity.status} /></td>
              <td>
                {activity.featured ? (
                  <span className={styles.featuredBadge}>
                    <AdminIcon name="star" size={12} />
                    Featured
                  </span>
                ) : (
                  <span className={styles.notFeatured}>—</span>
                )}
              </td>
              <td className={styles.muted}>{formatDate(activity.lastUpdated)}</td>
              <td className={styles.actionsCol}>
                <ActivityQuickActions activity={activity} onView={onViewActivity} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
