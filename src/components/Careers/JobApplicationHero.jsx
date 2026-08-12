import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './JobApplicationHero.module.css';

export default function JobApplicationHero({
  jobTitle,
  department,
  location,
  type,
  backgroundImage,
  breadcrumbs,
  ariaLabel,
}) {
  const contentRef = useScrollReveal(0.12);

  return (
    <section className={styles.hero} aria-label={ariaLabel ?? `Apply for ${jobTitle}`}>
      <div className={styles.background}>
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className={styles.bgImage}
          fetchpriority="high"
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

          <span className="section-label">Application</span>
          <h1 className={styles.title}>Apply for {jobTitle}</h1>
          <p className={styles.subtitle}>
            Please complete the form below. Our team will review your application and contact
            shortlisted candidates.
          </p>

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
