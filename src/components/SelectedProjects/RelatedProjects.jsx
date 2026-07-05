import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './RelatedProjects.module.css';

export default function RelatedProjects({ projects, categoryTitle }) {
  const headerRef = useScrollReveal(0.1);
  const gridRef = useScrollReveal(0.06);

  if (!projects?.length) return null;

  return (
    <section className={styles.related} aria-label="Related projects">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">Related Projects</span>
          {categoryTitle && <p className={styles.subtitle}>More from {categoryTitle}</p>}
        </div>

        <div ref={gridRef} className={`${styles.grid} reveal reveal-delay-1`}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.card}>
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
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.overlay} aria-hidden="true" />
                </div>
                <h2 className={styles.title}>{project.title}</h2>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
