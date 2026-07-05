import AdminIcon from '../../components/AdminIcons';
import ApplicationQuickActions, { ApplicationStatusBadge } from './ApplicationQuickActions';
import styles from './ApplicationsTableView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ApplicationsTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onApplicationClick,
  onViewApplication,
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
                aria-label="Select all applications on this page"
              />
            </th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Department</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Submitted Date</th>
            <th>CV</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((app) => (
            <tr
              key={app.id}
              className={`${styles.row} ${selectedIds.has(app.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(app.id)}
                  onChange={() => onToggleSelect(app.id)}
                  aria-label={`Select ${app.applicantName}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className={styles.candidateBtn}
                  onClick={() => onApplicationClick(app.id)}
                >
                  <span className={styles.name}>{app.applicantName}</span>
                  <span className={styles.email}>{app.email}</span>
                  <span className={styles.phone}>{app.phone}</span>
                </button>
              </td>
              <td className={styles.muted}>
                <span className={styles.jobTitle}>{app.jobTitle}</span>
              </td>
              <td className={styles.muted}>{app.department}</td>
              <td className={styles.muted}>
                {app.yearsOfExperience} {app.yearsOfExperience === 1 ? 'year' : 'years'}
              </td>
              <td><ApplicationStatusBadge status={app.status} /></td>
              <td className={styles.muted}>{formatDate(app.submittedDate)}</td>
              <td>
                <span className={styles.cvBadge}>
                  <AdminIcon name="export" size={12} />
                  {app.cvFileName}
                </span>
              </td>
              <td className={styles.actionsCol}>
                <ApplicationQuickActions
                  application={app}
                  onView={onViewApplication}
                  onAction={onAction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
