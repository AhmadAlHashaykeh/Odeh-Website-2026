import { StatusBadge } from '../../cms/components';
import ProjectQuickActions from './ProjectQuickActions';
import styles from './ProjectsCardView.module.css';

export default function ProjectsCardView({
  items,
  selectedIds,
  onToggleSelect,
  onProjectClick,
  onViewProject,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((project) => (
        <article
          key={project.id}
          className={`${styles.card} ${selectedIds.has(project.id) ? styles.selected : ''}`}
        >
          <div className={styles.body}>
            <div className={styles.cardTop}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(project.id)}
                onChange={() => onToggleSelect(project.id)}
                aria-label={`Select ${project.title}`}
              />
              <ProjectQuickActions project={project} onView={onViewProject} onAction={onAction} />
            </div>

            <button
              type="button"
              className={styles.titleBtn}
              onClick={() => onProjectClick(project.id)}
            >
              <h3 className={styles.title}>{project.title}</h3>
            </button>

            <div className={styles.meta}>
              <span className={styles.category}>{project.category || '—'}</span>
              <StatusBadge status={project.status} />
            </div>

            <p className={styles.location}>{project.location || '—'}</p>
            <p className={styles.location}>{project.area || '—'}</p>
            <p className={styles.location}>{project.architect || '—'}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
