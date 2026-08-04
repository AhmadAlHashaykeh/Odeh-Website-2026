import { StatusBadge } from '../../cms/components';
import ProjectQuickActions from './ProjectQuickActions';
import styles from './ProjectsTableView.module.css';

export default function ProjectsTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onProjectClick,
  onViewProject,
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
                aria-label="Select all projects on this page"
              />
            </th>
            <th>Project Name</th>
            <th>Area (m²)</th>
            <th>Location</th>
            <th>Architect</th>
            <th>Category</th>
            <th>Status</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((project) => (
            <tr
              key={project.id}
              className={`${styles.row} ${selectedIds.has(project.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(project.id)}
                  onChange={() => onToggleSelect(project.id)}
                  aria-label={`Select ${project.title}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className={styles.nameBtn}
                  onClick={() => onProjectClick(project.id)}
                >
                  <span className={styles.name}>{project.title}</span>
                </button>
              </td>
              <td className={styles.muted}>{project.area || '—'}</td>
              <td className={styles.muted}>{project.location || '—'}</td>
              <td className={styles.muted}>{project.architect || '—'}</td>
              <td className={styles.muted}>{project.category || '—'}</td>
              <td><StatusBadge status={project.status} /></td>
              <td className={styles.actionsCol}>
                <ProjectQuickActions project={project} onView={onViewProject} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
