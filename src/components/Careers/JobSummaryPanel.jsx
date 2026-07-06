import { Link } from 'react-router-dom';
import { formatJobDate, getJobApplyPath } from '../../utils/contentPaths';
import styles from './JobSummaryPanel.module.css';

function SummaryRow({ label, value }) {
  if (!value) return null;

  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}

export default function JobSummaryPanel({ job }) {
  const isClosed = job.status === 'closed';

  return (
    <aside className={styles.panel} aria-label="Job summary">
      <h2 className={styles.heading}>Role Summary</h2>

      <dl className={styles.list}>
        <SummaryRow label="Department" value={job.department} />
        <SummaryRow label="Location" value={job.location} />
        <SummaryRow label="Type" value={job.type} />
        <SummaryRow label="Experience Level" value={job.experienceLevel} />
        <SummaryRow label="Work Mode" value={job.workMode} />
        <SummaryRow label="Posted Date" value={formatJobDate(job.postedDate)} />
        <SummaryRow label="Closing Date" value={formatJobDate(job.closingDate)} />
      </dl>

      {isClosed ? (
        <span className={styles.closedBadge} role="status">
          Applications Closed
        </span>
      ) : (
        <Link to={getJobApplyPath(job)} className={`btn btn-primary ${styles.applyBtn}`}>
          Apply Now
        </Link>
      )}
    </aside>
  );
}
