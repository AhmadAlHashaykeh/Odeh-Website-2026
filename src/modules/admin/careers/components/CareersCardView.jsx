import AdminIcon from '../../components/AdminIcons';
import { isClosingSoon } from '../mock/careersData';
import JobQuickActions from './JobQuickActions';
import styles from './CareersCardView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function JobStatusBadge({ status }) {
  const config = {
    open: { label: 'Open', className: styles.open },
    closed: { label: 'Closed', className: styles.closed },
    draft: { label: 'Draft', className: styles.draft },
  }[status] || { label: status, className: styles.closed };

  return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
}

export default function CareersCardView({
  items,
  selectedIds,
  onToggleSelect,
  onJobClick,
  onViewJob,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((job) => {
        const closingSoon = job.status === 'open' && isClosingSoon(job.closingDate);

        return (
          <article
            key={job.id}
            className={`${styles.card} ${selectedIds.has(job.id) ? styles.selected : ''}`}
          >
            <div className={styles.header}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(job.id)}
                onChange={() => onToggleSelect(job.id)}
                aria-label={`Select ${job.title}`}
              />
              <JobQuickActions job={job} onView={onViewJob} onAction={onAction} />
            </div>

            <div className={styles.body}>
              <span className={styles.department}>{job.department}</span>

              <button
                type="button"
                className={styles.titleBtn}
                onClick={() => onJobClick(job.id)}
              >
                <h3 className={styles.title}>{job.title}</h3>
              </button>

              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <AdminIcon name="connect" size={13} />
                  {job.location}
                </span>
                <span className={styles.metaItem}>
                  <AdminIcon name="careers" size={13} />
                  {job.employmentType}
                </span>
                <span className={styles.metaItem}>
                  <AdminIcon name="home" size={13} />
                  {job.workMode}
                </span>
                <span className={styles.metaItem}>
                  <AdminIcon name="team" size={13} />
                  {job.experienceLevel}
                </span>
              </div>

              <p className={styles.description}>{job.shortDescription}</p>

              <div className={styles.footer}>
                <div className={styles.badges}>
                  <JobStatusBadge status={job.status} />
                  {closingSoon && (
                    <span className={styles.closingSoon}>Closing Soon</span>
                  )}
                </div>

                <div className={styles.stats}>
                  <span className={styles.applications}>
                    <AdminIcon name="applications" size={12} />
                    {job.applicationsCount} applications
                  </span>
                  <span className={styles.closing}>
                    Closes {formatDate(job.closingDate)}
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
