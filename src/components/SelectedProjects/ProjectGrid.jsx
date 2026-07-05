import { useScrollReveal } from '../../hooks/useScrollReveal';
import ProjectCard from './ProjectCard';
import styles from './ProjectGrid.module.css';

export default function ProjectGrid({ projects }) {
  const gridRef = useScrollReveal(0.06);

  if (!projects?.length) {
    return (
      <section className={styles.section}>
        <div className="container">
          <p className={styles.empty}>No projects available in this category yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Projects in category">
      <div className="container">
        <div ref={gridRef} className={`${styles.grid} reveal`}>
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
