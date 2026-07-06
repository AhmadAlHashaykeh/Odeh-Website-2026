import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ProjectQuickActions from './ProjectQuickActions';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './ProjectsTableView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

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
            <th className={styles.thumbCol}>Cover</th>
            <th>Project Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Last Updated</th>
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
              <td className={styles.thumbCol}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => onProjectClick(project.id)}
                  aria-label={`View ${project.title}`}
                >
                  <img src={resolveMediaUrl(project.coverImage)}
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
                  onClick={() => onProjectClick(project.id)}
                >
                  <span className={styles.name}>{project.title}</span>
                  <span className={styles.slug}>/{project.slug}</span>
                </button>
              </td>
              <td className={styles.muted}>{project.category}</td>
              <td className={styles.muted}>{project.location}</td>
              <td className={styles.muted}>{project.projectType}</td>
              <td><StatusBadge status={project.status} /></td>
              <td>
                {project.featured ? (
                  <span className={styles.featuredBadge}>
                    <AdminIcon name="star" size={12} />
                    Featured
                  </span>
                ) : (
                  <span className={styles.notFeatured}>—</span>
                )}
              </td>
              <td className={styles.muted}>{formatDate(project.lastUpdated)}</td>
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
