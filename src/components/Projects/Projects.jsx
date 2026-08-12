import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProjectPath } from '../../utils/contentPaths';
import SafeImage from '../SafeImage/SafeImage';
import styles from './Projects.module.css';

function ViewProjectLabel({ className = '' }) {
  return (
    <span className={`${styles.viewLink} ${className}`}>
      View Project
      <span className={styles.viewLinkArrow} aria-hidden="true">
        →
      </span>
    </span>
  );
}

function FeaturedProjectCard({ project, className = '' }) {
  return (
    <article className={`${styles.featuredCard} ${className}`}>
      <Link
        to={getProjectPath(project)}
        className={styles.cardLink}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.imageLayer}>
          <SafeImage
            src={project.image ?? project.coverImage}
            fallbackSrc={project.fallbackImage}
            alt={project.title}
            className={styles.cardImage}
            loading="eager"
          />
          <div className={styles.overlay} />
        </div>
        <div className={styles.featuredContent}>
          <div className={styles.metaRow}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.location}>{project.location}</span>
          </div>
          <h3 className={styles.featuredTitle}>{project.title}</h3>
          <p className={styles.featuredDesc}>{project.description}</p>
          <ViewProjectLabel />
        </div>
      </Link>
    </article>
  );
}

function SecondaryProjectCard({ project, className = '' }) {
  return (
    <article className={`${styles.secondaryCard} ${className}`}>
      <Link
        to={getProjectPath(project)}
        className={styles.cardLink}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.imageLayer}>
          <SafeImage
            src={project.image ?? project.coverImage}
            fallbackSrc={project.fallbackImage}
            alt={project.title}
            className={styles.cardImage}
          />
          <div className={styles.overlaySecondary} />
        </div>
        <div className={styles.secondaryContent}>
          <div className={styles.metaRow}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.location}>{project.location}</span>
          </div>
          <h3 className={styles.secondaryTitle}>{project.title}</h3>
          <ViewProjectLabel />
        </div>
      </Link>
    </article>
  );
}

export default function Projects({ content = {} }) {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.08);

  const sectionLabel = content.sectionLabel ?? 'Selected Projects';
  const heading = content.heading ?? 'Engineering Excellence Across the Middle East';
  const headerDesc =
    content.description ??
    'Landmark structures and infrastructure delivered with precision — a curated selection from our portfolio across the region.';
  const featuredProjects = content.projects ?? [];
  const viewAllLabel = content.viewAllLabel ?? 'View All Projects';
  const viewAllPath = content.viewAllPath ?? '/projects';

  const showcaseProjects = featuredProjects.slice(0, 3);
  const [featured, ...sideStack] = showcaseProjects;

  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.headerDesc}>{headerDesc}</p>
        </div>

        {featured && (
          <div ref={gridRef} className={`${styles.editorialGrid} ${styles.revealGrid}`}>
            <FeaturedProjectCard
              project={featured}
              className={`${styles.revealCard} reveal-delay-1`}
            />
            {sideStack.length > 0 && (
              <div className={styles.sideStack}>
                {sideStack.map((project, index) => (
                  <SecondaryProjectCard
                    key={project.id ?? project.slug}
                    project={project}
                    className={`${styles.revealCard} reveal-delay-${index + 2}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.viewAllFooter}>
          <Link to={viewAllPath} className={styles.viewAllLink}>
            {viewAllLabel}
            <span className={styles.viewAllArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
