import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { featuredProjects } from '../../data/projects';
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
        to={`/projects/${project.categorySlug}/${project.slug}`}
        className={styles.cardLink}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.imageLayer}>
          <SafeImage
            src={project.image}
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
        to={`/projects/${project.categorySlug}/${project.slug}`}
        className={styles.cardLink}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.imageLayer}>
          <SafeImage
            src={project.image}
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

export default function Projects() {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.08);

  const showcaseProjects = featuredProjects.slice(0, 3);
  const [featured, ...sideStack] = showcaseProjects;

  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">Selected Projects</span>
          <h2 className={styles.heading}>Engineering Excellence Across the Middle East</h2>
          <p className={styles.headerDesc}>
            Landmark structures and infrastructure delivered with precision — a curated selection
            from our portfolio across the region.
          </p>
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
                    key={project.id}
                    project={project}
                    className={`${styles.revealCard} reveal-delay-${index + 2}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.viewAllFooter}>
          <Link to="/projects" className={styles.viewAllLink}>
            View All Projects
            <span className={styles.viewAllArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
