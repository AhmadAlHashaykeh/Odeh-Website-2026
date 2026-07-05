import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ProjectsHero.module.css';

export default function ProjectsHero({
  label,
  title,
  description,
  breadcrumbs,
  backgroundImage,
  ariaLabel,
  projectCount,
  variant = 'internal',
}) {
  const contentRef = useScrollReveal(0.12);
  const isCategory = variant === 'category';

  return (
    <section
      className={`${styles.hero} ${isCategory ? styles.heroCategory : styles.heroInternal}`}
      aria-label={ariaLabel ?? title}
    >
      {backgroundImage && (
        <div className={styles.background}>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className={styles.bgImage}
            fetchPriority="high"
            decoding="async"
          />
          <div className={styles.overlay} />
        </div>
      )}

      {!backgroundImage && <div className={styles.internalBg} aria-hidden="true" />}

      <div className={`container ${styles.layout}`}>
        <div ref={contentRef} className={`${styles.content} reveal`}>
          {breadcrumbs?.length > 0 && (
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <ol className={styles.breadcrumbList}>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={`${crumb.label}-${index}`} className={styles.breadcrumbItem}>
                      {index > 0 && (
                        <span className={styles.breadcrumbSep} aria-hidden="true">
                          /
                        </span>
                      )}
                      {crumb.path && !isLast ? (
                        <Link to={crumb.path} className={styles.breadcrumbLink}>
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className={isLast ? styles.breadcrumbCurrent : styles.breadcrumbText}
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {label && <span className="section-label">{label}</span>}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {typeof projectCount === 'number' && (
            <p className={styles.count}>
              {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
