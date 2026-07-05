import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './OverviewHero.module.css';

export default function OverviewHero({
  label,
  title,
  subtitle,
  description,
  backgroundImage,
  breadcrumbs,
  ariaLabel,
  compact = false,
}) {
  const contentRef = useScrollReveal(0.12);

  return (
    <section
      className={`${styles.hero} ${compact ? styles.heroCompact : ''}`}
      aria-label={ariaLabel ?? title}
    >
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

      <div className={`container ${styles.layout}`}>
        <div ref={contentRef} className={`${styles.content} reveal`}>
          {breadcrumbs?.length > 0 && (
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <ol className={styles.breadcrumbList}>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={crumb.label} className={styles.breadcrumbItem}>
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

          <span className="section-label">{label}</span>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb} />
        </div>
      </div>
    </section>
  );
}
