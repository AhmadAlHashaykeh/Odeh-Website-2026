import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './JobDetailHero.module.css';

export default function JobDetailHero({
  title,
  department,
  location,
  type,
  heroImage,
  breadcrumbs,
  ariaLabel,
}) {
  const contentRef = useScrollReveal(0.12);

  return (
    <section className={styles.hero} aria-label={ariaLabel ?? title}>
      <div className={styles.background}>
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className={styles.bgImage}
          fetchPriority="high"
          decoding="async"
        />
        <div className={styles.overlay} />
      </div>

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

          <h1 className={styles.title}>{title}</h1>

          <ul className={styles.metaList} aria-label="Role summary">
            <li>{department}</li>
            <li>{location}</li>
            <li>{type}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
