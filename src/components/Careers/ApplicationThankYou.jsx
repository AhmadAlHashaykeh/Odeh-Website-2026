import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getJobPath } from '../../data/careers';
import styles from './ApplicationThankYou.module.css';

export default function ApplicationThankYou({ job, backgroundImage, breadcrumbs }) {
  const heroRef = useScrollReveal(0.12);
  const contentRef = useScrollReveal(0.08);

  return (
    <>
      <section className={styles.hero} aria-label="Application submitted">
        <div className={styles.background}>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className={styles.bgImage}
            decoding="async"
          />
          <div className={styles.overlay} />
        </div>

        <div className={`container ${styles.layout}`}>
          <div ref={heroRef} className={`${styles.heroContent} reveal`}>
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

            <span className="section-label">Thank You</span>
            <h1 className={styles.title}>Application Received</h1>
            <p className={styles.subtitle}>
              Your application for {job.title} has been submitted successfully.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-label="Next steps">
        <div className="container">
          <div ref={contentRef} className={`${styles.panel} reveal`} role="status">
            <p className={styles.message}>
              Thank you for applying. Your application has been received successfully. Our team will
              review your profile and contact you if your experience matches the role.
            </p>

            <div className={styles.actions}>
              <Link to="/careers" className="btn btn-primary">
                Back to Careers
              </Link>
              <Link to={getJobPath(job)} className="btn btn-secondary">
                View Role
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
