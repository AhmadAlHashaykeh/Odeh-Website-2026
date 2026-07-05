import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, priority = false }) {
  return (
    <article className={styles.card}>
      <Link
        to={`/projects/${project.categorySlug}/${project.slug}`}
        className={styles.cardLink}
        aria-label={`View project: ${project.title}`}
      >
        <div className={styles.imageWrap}>
          <img
            src={project.coverImage}
            alt={project.title}
            className={styles.image}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className={styles.overlay} aria-hidden="true" />
        </div>

        <div className={styles.meta}>
          <h2 className={styles.title}>{project.title}</h2>
          {project.description && <p className={styles.description}>{project.description}</p>}
          {project.location && <p className={styles.location}>{project.location}</p>}
          <span className={styles.action}>
            View Project
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
