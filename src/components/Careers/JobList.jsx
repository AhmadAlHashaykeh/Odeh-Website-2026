import { useScrollReveal } from '../../hooks/useScrollReveal';
import JobCard from './JobCard';
import CareersEmptyState from './CareersEmptyState';
import styles from './JobList.module.css';

export default function JobList({ jobs, emptyState, showGlobalEmpty = false }) {
  const sectionRef = useScrollReveal(0.08);

  if (showGlobalEmpty) {
    return (
      <section className={styles.listing} aria-label="Job openings">
        <div className="container">
          <CareersEmptyState {...emptyState} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.listing} aria-label="Job openings">
      <div className="container">
        <div ref={sectionRef} className={`${styles.wrapper} reveal`}>
          <header className={styles.header}>
            <span className="section-label">Open Positions</span>
            <h2 className={styles.title}>
              {jobs.length === 1 ? 'Current Opening' : 'Current Openings'}
            </h2>
            <p className={styles.lead}>
              {jobs.length === 1
                ? 'We have one role available. Review the details and apply if your experience aligns with our team.'
                : `We are actively hiring for ${jobs.length} roles. Select a position to view the full description and apply.`}
            </p>
          </header>

          <ul className={styles.list}>
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
