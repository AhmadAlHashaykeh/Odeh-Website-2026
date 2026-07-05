import AdminIcon from '../../components/AdminIcons';
import JobQuickActions from './JobQuickActions';
import styles from './CareersTableView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatUpdated(value) {
  return new Date(value).toLocaleDateString('en-US', {
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

export default function CareersTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onJobClick,
  onViewJob,
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
                aria-label="Select all jobs on this page"
              />
            </th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Location</th>
            <th>Type</th>
            <th>Work Mode</th>
            <th>Status</th>
            <th>Applications</th>
            <th>Closing Date</th>
            <th>Last Updated</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((job) => (
            <tr
              key={job.id}
              className={`${styles.row} ${selectedIds.has(job.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(job.id)}
                  onChange={() => onToggleSelect(job.id)}
                  aria-label={`Select ${job.title}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className={styles.nameBtn}
                  onClick={() => onJobClick(job.id)}
                >
                  <span className={styles.name}>{job.title}</span>
                  <span className={styles.experience}>{job.experienceLevel}</span>
                </button>
              </td>
              <td className={styles.muted}>{job.department}</td>
              <td className={styles.muted}>
                <span className={styles.locationCell}>
                  <AdminIcon name="connect" size={12} />
                  {job.location}
                </span>
              </td>
              <td className={styles.muted}>{job.employmentType}</td>
              <td className={styles.muted}>{job.workMode}</td>
              <td><JobStatusBadge status={job.status} /></td>
              <td>
                <span className={styles.applications}>
                  <AdminIcon name="applications" size={12} />
                  {job.applicationsCount}
                </span>
              </td>
              <td className={styles.muted}>{formatDate(job.closingDate)}</td>
              <td className={styles.muted}>{formatUpdated(job.lastUpdated)}</td>
              <td className={styles.actionsCol}>
                <JobQuickActions job={job} onView={onViewJob} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
