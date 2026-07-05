import AdminIcon from '../../components/AdminIcons';
import ApplicationQuickActions, { ApplicationStatusBadge } from './ApplicationQuickActions';
import styles from './ApplicationsCardView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ApplicationsCardView({
  items,
  selectedIds,
  onToggleSelect,
  onApplicationClick,
  onViewApplication,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((app) => (
        <article
          key={app.id}
          className={`${styles.card} ${selectedIds.has(app.id) ? styles.selected : ''}`}
        >
          <div className={styles.header}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedIds.has(app.id)}
              onChange={() => onToggleSelect(app.id)}
              aria-label={`Select ${app.applicantName}`}
            />
            <ApplicationQuickActions
              application={app}
              onView={onViewApplication}
              onAction={onAction}
            />
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.nameBtn}
              onClick={() => onApplicationClick(app.id)}
            >
              <h3 className={styles.name}>{app.applicantName}</h3>
            </button>

            <span className={styles.jobTitle}>{app.jobTitle}</span>
            <span className={styles.department}>{app.department}</span>

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <AdminIcon name="team" size={13} />
                {app.yearsOfExperience} {app.yearsOfExperience === 1 ? 'year' : 'years'}
              </span>
              <span className={styles.metaItem}>
                <AdminIcon name="sort" size={13} />
                {formatDate(app.submittedDate)}
              </span>
            </div>

            <p className={styles.coverLetter}>{app.coverLetterPreview}</p>

            <div className={styles.footer}>
              <ApplicationStatusBadge status={app.status} />
              <span className={styles.cvBadge}>
                <AdminIcon name="export" size={12} />
                {app.cvFileName}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
