import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ProjectQuickActions from './ProjectQuickActions';
import styles from './ProjectsCardView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

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
          <div className={styles.imageWrap}>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => onProjectClick(project.id)}
              aria-label={`View ${project.title}`}
            >
              <img src={resolveMediaUrl(project.coverImage)}
                alt={project.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.imageOverlay} aria-hidden="true" />
            </button>

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

            {project.featured && (
              <span className={styles.featuredRibbon}>
                <AdminIcon name="star" size={12} />
                Featured
              </span>
            )}
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.titleBtn}
              onClick={() => onProjectClick(project.id)}
            >
              <h3 className={styles.title}>{project.title}</h3>
            </button>

            <div className={styles.meta}>
              <span className={styles.category}>{project.category}</span>
              <StatusBadge status={project.status} />
            </div>

            <p className={styles.location}>{project.location}</p>
            <span className={styles.date}>Updated {formatDate(project.lastUpdated)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
